export interface User {
  id?: string;
  email: string;
  displayName?: string;
  company?: string;
  createdAt?: any; // Firebase Timestamp
}
