export interface OverflowMenuItem {
  labelKey: string;
  route: '/(home)/categories' | '/(home)/settings';
}

export const overflowMenuItems: OverflowMenuItem[] = [
  { labelKey: 'nav.categories', route: '/(home)/categories' },
  { labelKey: 'nav.profile', route: '/(home)/settings' },
];
