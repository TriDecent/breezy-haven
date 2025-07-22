'use client';

import { useState } from 'react';

const shownWordsCount = 40;

export default function TextExpander({ children }: { children: string }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const displayText = isExpanded
    ? children
    : `${children.split(' ').slice(0, shownWordsCount).join(' ')}...`;

  return (
    <span>
      {displayText}{' '}
      <button
        className='text-primary-700 border-primary-700 border-b pb-1 leading-3 hover:cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </span>
  );
}
