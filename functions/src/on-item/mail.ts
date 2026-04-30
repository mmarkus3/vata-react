import { firestore } from 'firebase-admin';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getGeneralTemplate } from '../email/general.template';
import { sendEmail } from '../email/send-email';

export const onMail = onDocumentCreated({ document: '/mail/{documentId}', region: 'europe-north1' }, async (event) => {
  const document = event.data?.data();

  if (document) {
    if (document.fullfilment) {
      const fullfilmentRef = firestore().doc(`fullfilments/${document.fullfilment}`);
      const fullfilmentDoc = await fullfilmentRef.get();
      const fullfilment = fullfilmentDoc.data();
      const products = fullfilment?.products;
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
      return sendEmail(document.email, title, html, document.from, document.replayTo);
    } else {
      return sendEmail(document.email, 'Testi', getGeneralTemplate('Testi', 'Puuttuu täyttö-id'), document.from, document.replayTo);
    }
  } else {
    return;
  }
});
