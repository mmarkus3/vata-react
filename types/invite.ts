export interface Invite {
  id?: string;
  email: string;
  company: string;
  companyName: string;
  invitedBy: string;
  createdAt: Date;
  status: 'pending' | 'accepted' | 'expired';
}
