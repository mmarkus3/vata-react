import type { Campaign } from '@/types/campaign';
import { isTimestamp } from '@/utils/date';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { getSnapshotItems, saveItem, whereEqual } from './firestore';

const converter = {
  toFirestore: (item: Campaign) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined) => {
    const campaign = snapshot.data(options) as Campaign;

    const start = isTimestamp(campaign.start)
      ? campaign.start.toDate()
      : campaign.start != null
        ? new Date(campaign.start as unknown as string)
        : new Date();

    const end = isTimestamp(campaign.end)
      ? campaign.end.toDate()
      : campaign.end != null
        ? new Date(campaign.end as unknown as string)
        : new Date();

    return { ...campaign, start, end };
  },
};

export function getCampaignsByCompany(companyId: string, cb: (results: Campaign[]) => void) {
  try {
    return getSnapshotItems<Campaign>('campaigns', cb, [whereEqual('company', companyId)], converter);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    throw error;
  }
}

export async function createCampaign(campaign: Campaign): Promise<string> {
  try {
    return await saveItem('campaigns', {
      ...campaign,
      created: campaign.created ?? new Date(),
    });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    throw new Error(error instanceof Error ? error.message : 'Campaign save failed');
  }
}
