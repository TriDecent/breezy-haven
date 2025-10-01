import { stagger, useAnimate } from 'framer-motion';
import { useEffect } from 'react';

export function useShakeError(error: unknown) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!error) return;
    animate(
      scope.current.querySelectorAll('input.error, textarea.error'),
      { x: [0, -10, 0, 10, 0] },
      { type: 'keyframes', duration: 0.5, delay: stagger(0.2) }
    );
  }, [animate, error, scope]);

  return scope;
}
