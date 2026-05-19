export interface OverflowMenuItem {
  labelKey: string;
  route: '/(home)/categories' | '/(home)/campaigns' | '/(home)/settings';
}

export const overflowMenuItems: OverflowMenuItem[] = [
  { labelKey: 'nav.categories', route: '/(home)/categories' },
  { labelKey: 'nav.campaigns', route: '/(home)/campaigns' },
  { labelKey: 'nav.profile', route: '/(home)/settings' },
];
