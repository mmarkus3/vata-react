import fs from 'fs';
import path from 'path';
import { showConfirmation } from '@/components/ui/confirm';
import { Alert, Platform } from 'react-native';

const setPlatform = (os: string) => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
};

describe('showConfirmation', () => {
  const originalWindowConfirm = window.confirm;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.confirm = originalWindowConfirm;
    setPlatform('ios');
    jest.restoreAllMocks();
  });

  it('uses React Native Alert on native platforms', () => {
    setPlatform('ios');
    const onConfirm = jest.fn();
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    window.confirm = jest.fn(() => false);

    showConfirmation({
      title: 'Delete product',
      message: 'Are you sure?',
      cancelText: 'Cancel',
      confirmText: 'Delete',
      destructive: true,
      onConfirm,
    });

    expect(window.confirm).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Delete product', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      expect.objectContaining({
        text: 'Delete',
        style: 'destructive',
      }),
    ]);

    const confirmButton = alertSpy.mock.calls[0][2]?.[1];
    confirmButton?.onPress?.();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('executes confirm callback when web confirm is accepted', () => {
    setPlatform('web');
    const onConfirm = jest.fn();
    window.confirm = jest.fn(() => true);

    showConfirmation({
      title: 'Delete campaign',
      message: 'Really delete?',
      cancelText: 'Cancel',
      confirmText: 'Delete',
      destructive: true,
      onConfirm,
    });

    expect(window.confirm).toHaveBeenCalledWith('Delete campaign\n\nReally delete?');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not execute confirm callback when web confirm is cancelled', () => {
    setPlatform('web');
    const onConfirm = jest.fn();
    window.confirm = jest.fn(() => false);

    showConfirmation({
      title: 'Delete category',
      message: 'Really delete?',
      cancelText: 'Cancel',
      confirmText: 'Delete',
      destructive: true,
      onConfirm,
    });

    expect(window.confirm).toHaveBeenCalledWith('Delete category\n\nReally delete?');
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('routes migrated delete screens through the shared helper', () => {
    for (const file of ['app/product/[id].tsx', 'app/campaign/[id].tsx', 'app/category/[id].tsx']) {
      const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
      expect(source).toContain('showConfirmation');
      expect(source).not.toContain('Alert.alert');
    }
  });
});
