'use client';
import { Variants } from '@/shared/animations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Menu, UserCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { logoutAction } from './logoutAction';

export function SubMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className='outline-none'>
        <AnimatePresence mode='wait' initial={false}>
          {isOpen ? (
            <AnimationWrapper key='x'>
              <X size={32} />
            </AnimationWrapper>
          ) : (
            <AnimationWrapper key='menu'>
              <Menu size={32} />
            </AnimationWrapper>
          )}
        </AnimatePresence>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.staff.nested.profile.href}>
            <UserCircle /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logoutAction}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AnimationWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      key='menu'
      variants={Variants.zoomRotate.variant()}
      initial={Variants.zoomRotate.key.hidden}
      animate={Variants.zoomRotate.key.visible}
      exit={Variants.zoomRotate.key.exit}
      transition={{
        type: 'tween',
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
