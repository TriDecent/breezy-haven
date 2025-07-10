import type { Variant } from 'framer-motion';

export type SlideVariantKey = 'hidden' | 'visible' | 'safelyHidden';

const slideVariant = (
  x: number,
  y: number
): Readonly<Record<SlideVariantKey, Variant>> => {
  return {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0 },
    safelyHidden: {
      opacity: 0,
      x,
      y,
      transitionEnd: { display: 'none' },
    },
  };
};

export const slideVariantKeys: Readonly<
  Record<SlideVariantKey, SlideVariantKey>
> = {
  hidden: 'hidden',
  visible: 'visible',
  safelyHidden: 'safelyHidden',
};

const Variants = {
  slideVariant,
} as const;

export default Variants;
