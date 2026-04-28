import type { Invite } from '@/types/invite';
import { where } from 'firebase/firestore';
import { getItems, saveItem, updateItem } from './firestore';

export async function getInviteByEmail(email: string): Promise<Invite | null> {
  try {
    const invites = await getItems<Invite>('invites',
      [where('email', '==', email),
      where('status', '==', 'pending')]
    );
    if (invites?.length > 0) {
      return invites[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to get invite by email:', error);
    return null;
  }
}

export async function acceptInvite(inviteId: string): Promise<void> {
  try {
    await updateItem('invites', inviteId, {
      status: 'accepted',
    });
  } catch (error) {
    console.error('Failed to accept invite:', error);
    throw error;
  }
}

export async function createInvite(email: string, companyId: string, companyName: string, invitedBy: string): Promise<string> {
  try {
    return saveItem('invites', {
      email,
      company: companyId,
      companyName,
      invitedBy,
      createdAt: new Date(),
      status: 'pending',
    });
  } catch (error) {
    console.error('Failed to create invite:', error);
    throw error;
  }
}