import { firestore } from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getGeneralTemplate } from '../email/general.template';
import { sendEmail } from '../email/send-email';
import { Order } from '../orders/order.interface';
import { Mail } from './mail.interface';

export interface SubItem {
  guid: string;
  name: string;
}

export interface FullfilmentItem extends SubItem {
  price: number;
  ean: string;
}

export interface FullfilmentProduct {
  amount: number;
  product: FullfilmentItem;
}

export function getPaidOrderNotificationBody(orderId: string, order: Order): string {
  const productRows = (order.products ?? []).map((product) => {
    const productName = product.name || '-';
    const productAmount = typeof product.amount === 'number' ? product.amount : 0;
    return `
      <tr>
        <td>${productName}</td>
        <td>${productAmount}</td>
      </tr>`;
  }).join('');

  return `
    <p>Uusi tilaus #${orderId} on vastaanotettu.</p>
    <p><strong>Tuotteet</strong></p>
    <table>
      <tr>
        <th>Tuote</th><th>Määrä</th>
      </tr>
      ${productRows}
    </table>
  `;
}

export function getSentOrderBody(orderId: string, order: Order): string {
  const customer = order.customer;
  const customerName = [customer?.firstname, customer?.lastname].filter(Boolean).join(' ').trim() || '-';
  const customerAddress = [customer?.address_street, customer?.address_zip, customer?.address_city].filter(Boolean).join(', ') || '-';

  const productRows = (order.products ?? []).map((product) => {
    const productName = product.name || '-';
    const productAmount = typeof product.amount === 'number' ? product.amount : 0;
    return `
      <tr>
        <td>${productName}</td>
        <td>${productAmount}</td>
      </tr>`;
  }).join('');

  return `
    <p>Tilauksesi #${orderId} on lähetetty.</p>
    <p><strong>Asiakastiedot</strong></p>
    <p>
      ${customerName}<br/>
      ${customerAddress}
    </p>
    <p><strong>Tuotteet</strong></p>
    <table>
      <tr>
        <th>Tuote</th><th>Määrä</th>
      </tr>
      ${productRows}
    </table>
  `;
}

export const onMail = onDocumentCreated({ document: '/mail/{documentId}', region: 'europe-north1' }, async (event) => {
  const document = event.data?.data() as Mail;

  if (document) {
    if (document.fullfilment) {
      const fullfilmentRef = firestore().doc(`fullfilments/${document.fullfilment}`);
      const fullfilmentDoc = await fullfilmentRef.get();
      const fullfilment = fullfilmentDoc.data();
      const products = fullfilment?.products as FullfilmentProduct[];
      const tableContent = products?.map((p) => {
        return `
        <tr>
          <td>${p.product.name}</td>
          <td>${p.amount}</td>
          <td>${p.product.price > 0 ? p.product.price + '€' : ''}</td>
          <td>${p.product.price > 0 ? (p.product.price * p.amount) + '€' : ''}</td>
          <td>${p.product.ean ?? ''}</td>
        </tr>`;
      });

      const title = 'Tilaus yhteenveto';
      const body = `Oheiset tuotteet ovat täytetty kauppaanne<table>
        <tr>
          <th>Tuote</th><th>Määrä</th><th>Kappalehinta</th><th>Hinta yhteensä</th><th>EAN</th>
        </tr>
        ${tableContent}
      </table>
      <p>Hinnat sis. alv</p>
    `;
      const html = getGeneralTemplate(title, body);
      return sendEmail(document.email, title, html, document.from, document.replyTo);
    } else if (document.recieveNotification && document.order) {
      const orderRef = firestore().doc(`orders/${document.order}`);
      const orderDoc = await orderRef.get();
      const order = orderDoc.data() as Order;
      if (!order) {
        console.error(`Order ${document.order} not found for mail`);
        return;
      }

      const title = 'Uusi tilaus vastaanotettu';
      const body = getPaidOrderNotificationBody(document.order, order);
      const html = getGeneralTemplate(title, body);
      return sendEmail(document.email, title, html, document.from, document.replyTo);
    } else if (document.order) {
      const orderRef = firestore().doc(`orders/${document.order}`);
      const orderDoc = await orderRef.get();
      const order = orderDoc.data() as Order;
      if (!order) {
        console.error(`Order ${document.order} not found for mail`);
        return;
      }

      const title = 'Tilauksesi on lähetetty';
      const body = getSentOrderBody(document.order, order);
      const html = getGeneralTemplate(title, body);
      return sendEmail(document.email, title, html, document.from, document.replyTo);
    } else {
      console.error('Fullfilment and order id is missing');
      return;
    }
  } else {
    return;
  }
});
