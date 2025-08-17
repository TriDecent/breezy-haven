export interface CabinQuery {
  readonly capacity: 'all' | 'small' | 'medium' | 'large';
}

export const CabinCapacities: ReadonlyArray<string> = [
  'all',
  'small',
  'medium',
  'large',
];

type ViewCabinSizeClassifier = {
  [P in CabinQuery['capacity']]: P extends 'all'
    ? 'all'
    : P extends 'large'
      ? { startAt: number; endAt?: number }
      : { startAt: number; endAt: number };
};

export const viewSizeClassifier: ViewCabinSizeClassifier = {
  all: 'all',
  small: { startAt: 1, endAt: 3 },
  medium: { startAt: 4, endAt: 7 },
  large: { startAt: 8 },
};
