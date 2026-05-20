import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Campaign } from './campaign.interface';

@Injectable()
export class CampaignsService {

  async getCampaignByCodeAndCompany(companyId: string, code: string) {
    const campaignDocs = await firestore().collection('campaigns').where('company', '==', companyId).where('code', '==', code).get();
    if (campaignDocs.empty) {
      throw new NotFoundException('No campaign found');
    }
    const now = new Date();
    const campaigns = campaignDocs.docs.map((c) => c.data() as Campaign);
    const validCampaigns = campaigns.map((c) => {
      const startDate = c.start.toDate();
      const endDate = c.end.toDate();
      if (!startDate || !endDate) return null;
      if (now.getTime() < startDate.getTime() || now.getTime() > endDate.getTime()) return null;
      return c;
    }).filter((it) => it != null);
    if (validCampaigns.length === 0) {
      throw new NotFoundException('No campaign found');
    }
    const campaign = validCampaigns[0];
    if (campaign.company !== companyId) {
      throw new BadRequestException('Company mismatch');
    }
    return {
      id: campaign.id,
      code: campaign.code,
      products: campaign.products,
    };
  }
}
