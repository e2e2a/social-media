import VerificationForm from '@/components/shared/verification/VerificationForm';
import React from 'react';

const Verification = () => {
  return (
    <div className='flex px-2 sm:p-0 min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <VerificationForm />
    </div>
  );
};

export default Verification;
