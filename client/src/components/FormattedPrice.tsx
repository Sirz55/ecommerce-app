'use client';

import { useEffect, useState } from 'react';

type Props = {
  amount: number;
};

export const FormattedPrice = ({ amount }: Props) => {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    // Format number for Indian locale
    setFormatted(amount.toLocaleString('en-IN'));
  }, [amount]);

  return <span>₹{formatted}</span>;
};
