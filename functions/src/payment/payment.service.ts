import { Injectable } from '@nestjs/common';
import { setupVismaPay } from '../visma/options';

interface VismaPayResultParams {
  RETURN_CODE: string;
  AUTHCODE: string;
  ORDER_NUMBER: string;
  SETTLED: string;
  CONTACT_ID?: string;
  INCIDENT_ID?: string;
}

@Injectable()
export class PaymentService {

  async checkResult(companyId: string, query: VismaPayResultParams): Promise<boolean> {
    const vismaPay = await setupVismaPay(companyId);
    const paramsToCheck: VismaPayResultParams = { RETURN_CODE: query.RETURN_CODE, AUTHCODE: query.AUTHCODE, ORDER_NUMBER: query.ORDER_NUMBER, SETTLED: query.SETTLED };
    if (query.CONTACT_ID != null) {
      paramsToCheck.CONTACT_ID = query.CONTACT_ID;
    }
    if (query.INCIDENT_ID != null) {
      paramsToCheck.INCIDENT_ID = query.INCIDENT_ID;
    }
    return vismaPay.checkReturn(paramsToCheck)
      .then((ok: boolean) => {
        return ok;
      })
      .catch((err) => {
        console.error('Got error result:', err);
        return false;
      });
  }
}
