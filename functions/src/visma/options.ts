import { firestore } from 'firebase-admin';
import vismaPay from 'visma-pay';

export async function setupVismaPay(companyId: string) {
  const doc = await firestore().doc(`options/${companyId}`).get();
  const item = doc.data();
  vismaPay.setPrivateKey(item.vismapay.privateKey ?? '');
  vismaPay.setApiKey(item.vismapay.apiKey ?? '');

  return vismaPay;
}