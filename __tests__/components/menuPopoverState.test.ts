import { closeMenuPopover, toggleMenuPopover } from '@/home-config/menuPopoverState';

describe('menuPopoverState', () => {
  it('toggles popover state', () => {
    expect(toggleMenuPopover(false)).toBe(true);
    expect(toggleMenuPopover(true)).toBe(false);
  });

  it('closes popover state', () => {
    expect(closeMenuPopover()).toBe(false);
  });
});
