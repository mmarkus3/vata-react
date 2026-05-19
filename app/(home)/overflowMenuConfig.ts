export interface OverflowMenuItem {
  labelKey: string;
  route: '/(home)/clients' | '/(home)/categories' | '/(home)/settings';
}

export const overflowMenuItems: OverflowMenuItem[] = [
  { labelKey: 'nav.clients', route: '/(home)/clients' },
  { labelKey: 'nav.categories', route: '/(home)/categories' },
  { labelKey: 'nav.profile', route: '/(home)/settings' },
];
