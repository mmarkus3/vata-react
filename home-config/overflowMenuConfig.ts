export interface OverflowMenuItem {
  labelKey: string;
  route: '/(home)/categories' | '/(home)/campaigns' | '/(home)/options' | '/(home)/settings';
}

export const overflowMenuItems: OverflowMenuItem[] = [
  { labelKey: 'nav.categories', route: '/(home)/categories' },
  { labelKey: 'nav.campaigns', route: '/(home)/campaigns' },
  { labelKey: 'nav.options', route: '/(home)/options' },
  { labelKey: 'nav.profile', route: '/(home)/settings' },
];
