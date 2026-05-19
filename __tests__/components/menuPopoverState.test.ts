import { closeMenuPopover, toggleMenuPopover } from '@/app/(home)/menuPopoverState';

describe('menuPopoverState', () => {
  it('toggles popover state', () => {
    expect(toggleMenuPopover(false)).toBe(true);
    expect(toggleMenuPopover(true)).toBe(false);
  });

  it('closes popover state', () => {
    expect(closeMenuPopover()).toBe(false);
  });
});
