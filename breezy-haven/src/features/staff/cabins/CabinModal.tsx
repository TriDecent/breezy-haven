'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Modal,
} from '@/shared';
import { SquarePenIcon } from 'lucide-react';
import { CabinForm } from './CabinForm';

export const CabinModal = ({
  title,
  description,
  shouldOpenForm,
  onClose,
}: {
  title: string;
  description: string;
  shouldOpenForm: boolean;
  onClose: () => void;
}) => (
  <Modal isOpen={shouldOpenForm} onClose={onClose}>
    <Card>
      <CardHeader>
        <CardTitle>
          <p className='flex items-center gap-4'>
            <SquarePenIcon />
            <span>{title}</span>
          </p>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CabinForm />
      </CardContent>
    </Card>
  </Modal>
);
