'use client';
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Variants, { slideVariantKeys } from '../animations/Variants';

interface ModalProps extends HTMLMotionProps<'dialog'> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ children, isOpen, onClose, ...props }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('click', handleClickOutsideModal);
    document.body.classList.add('overflow-hidden');

    return () => {
      document.removeEventListener('click', handleClickOutsideModal);
      document.body.classList.remove('overflow-hidden');
    };

    function handleClickOutsideModal(e: MouseEvent): void {
      if (dialogRef.current !== e.target) return;
      onClose?.();
    }
  }, [isOpen, onClose]);

  useEffect(() => setIsMounted(true), []);

  return isMounted
    ? createPortal(
        <AnimatePresence>
          {isOpen ? (
            <motion.dialog
              ref={dialogRef}
              variants={Variants.slideVariant(0, 50)}
              initial={slideVariantKeys.hidden}
              animate={slideVariantKeys.visible}
              exit={slideVariantKeys.safelyHidden}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              onAnimationStart={definition => {
                if (definition !== slideVariantKeys.visible) return;
                dialogRef.current?.showModal();
              }}
              onCancel={e => {
                e.preventDefault();
                onClose?.();
              }}
              {...props}
              className='mx-auto my-auto w-4/5 max-w-2xl rounded-lg bg-transparent p-4 select-none backdrop:backdrop-blur-sm'
            >
              {children}
            </motion.dialog>
          ) : null}
        </AnimatePresence>,
        document.getElementById('modal')!
      )
    : null;
};

export default Modal;
