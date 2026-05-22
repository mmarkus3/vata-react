import { firestore } from 'firebase-admin';
import vismaPay from 'visma-pay';
import { Options } from '../options/options.interface';

export async function setupVismaPay(companyId: string) {
  const doc = await firestore().doc(`options/${companyId}`).get();
  const item = doc.data() as Options;
  vismaPay.setPrivateKey(item.vismapay?.privateKey ?? '');
  vismaPay.setApiKey(item.vismapay?.apiKey ?? '');

  return vismaPay;
}