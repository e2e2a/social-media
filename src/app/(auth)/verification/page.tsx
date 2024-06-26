'use client';
import React, { useCallback, useEffect, useState } from 'react';
import VerificationForm from './components/Form';
import { useTokenCheckQuery } from '@/lib/queries';
import { useRouter, useSearchParams } from 'next/navigation';

const Verification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { data: result, error, } = useTokenCheckQuery({ token });
  const checkToken = useCallback(async () => {
    if (!token) {
      // setMessage('Undefined Token or Token is Expired.');
      // setTypeMessage('error');
      return router.push('/recovery');
    }
    if (error) {
      // If there's an error from the query and it's the first error occurrence
      console.error('Error fetching token:', error.message);
      router.push('/recovery');
      return;
    }
  }, [token,error,router])
  useEffect(() => {
    checkToken()
    
    
    
  }, [checkToken]);
  
  return (
    <div className='flex px-2 sm:p-0 min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <VerificationForm result={result}/>
    </div>
  );
};

export default Verification;
