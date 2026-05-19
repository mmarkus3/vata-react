import type { SelectedPointInfo } from '@/services/order';
import type { Order } from '@/types/order';

export const getDeliveryMethodDisplay = (order: Order | null | undefined): string | null => {
  const raw = order?.deliveryMethod;
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export type SelectedPointState = 'idle' | 'loading' | 'success' | 'error' | 'missing';

export const getSelectedPointState = (input: {
  isLoading: boolean;
  error: string | null;
  point: SelectedPointInfo | null;
  hasPointId: boolean;
}): SelectedPointState => {
  if (!input.hasPointId) return 'missing';
  if (input.isLoading) return 'loading';
  if (input.error) return 'error';
  if (input.point) return 'success';
  return 'missing';
};
