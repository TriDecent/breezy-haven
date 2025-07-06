'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      onClick={() => setCount(count => count + 1)}
      className='rounded bg-slate-400 px-4 py-1 hover:cursor-pointer hover:bg-slate-200'
    >
      {count}
    </button>
  );
}
