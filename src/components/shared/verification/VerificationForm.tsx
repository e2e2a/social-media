'use client';
import React, {
  ChangeEvent,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import CardWrapper from '../auth/CardWrapper';
import { PulseLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  VerificationTokenSignUp,
  VerificationCodeSignUp,
  resendVerificationCode,
} from '@/actions/verification.actions';
import { FormError } from '../FormError';
import { FormSuccess } from '../FormSuccess';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VerificationTimer from './VerificationTimer';
import {
  handleChange,
  handlePaste,
} from '@/hook/verification/VerificationInputEvents';
import { makeToastError } from '@/lib/helpers/makeToast';

const VerificationForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [header, setHeader] = useState<string | undefined>('');
  const [labelLink, setLabelLink] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [inputCode, setInputCode] = useState<string[]>(Array(6).fill(''));
  const [tokenEmail, setTokenEmail] = useState<any>(null);
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const checkToken = useCallback(async () => {
    if (!token) {
      setError('Token Expired');
      return;
    }

    try {
      const data = await VerificationTokenSignUp(token);
      if (data.error) {
        setError(data.error);
      } else {
        setHeader('Confirming your verification code');
        setLabelLink('Resend Code');
        setLoading(false);
        if (
          data.existingToken &&
          data.existingToken.email &&
          data.existingToken.expiresCode
        ) {
          setTokenEmail(data.existingToken.email);
          setExpirationTime(new Date(data.existingToken.expiresCode));
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    checkToken();

    if (inputRefs.current.length !== inputCode.length) {
      inputRefs.current = Array(inputCode.length)
        .fill(null)
        .map((_, i) => inputRefs.current[i] || createRef<HTMLInputElement>());
    }
  }, [inputCode.length, checkToken]);

  const handleSubmit = async () => {
    const verificationCode = inputCode.join('');
    if (verificationCode.length !== 6)
      return makeToastError('Please complete the verification code.');
    const data = await VerificationCodeSignUp({
      email: tokenEmail,
      verificationCode,
    });

    if (data?.error) {
      makeToastError(data.error);
    } else {
      setLabelLink('');
      setSuccess('Verification completed!');
      router.push('/sign-in');
    }
    setLoading(false);
  };

  const calculateRemainingTime = () => {
    if (!expirationTime) return 0;
    const now = new Date();
    const diff = expirationTime.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000)); // return time in seconds
  };
  const onResendCode = async () => {
    await resendVerificationCode(tokenEmail);
    window.location.reload();
  };
  return (
    <CardWrapper
      headerLabel={header || 'Please double check your token or sign up again.'}
      backButtonHref=''
      backButtonLabel={labelLink}
      onResendCode={onResendCode}
    >
      {expirationTime && !success && (
        <VerificationTimer initialSeconds={calculateRemainingTime()} />
      )}
      <div className='flex items-center justify-center sm:p-5 p-0 gap-2 sm:gap-4'>
        {!error && !success && loading && (
          <PulseLoader className='text-sm gap-2 p-5' />
        )}
        {!error && !loading && !success
          ? inputCode.map((value, index) => (
              <Input
                key={index}
                maxLength={1}
                value={value}
                ref={inputRefs.current[index]}
                className='text-center rounded-md h-16 sm:text-3xl text-xl font-medium'
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(
                    index,
                    e.target.value,
                    inputCode,
                    setInputCode,
                    inputRefs
                  )
                }
                onPaste={(e) => handlePaste(e, inputCode, setInputCode, inputRefs)}
              />
            ))
          : null}

        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
      </div>
      {!error && !loading && !success ? (
        <>
          <p className='text-muted-foreground mt-3 sm:mt-0 text-sm'>
            • Enter the code from your email address.
          </p>
          <p className='text-muted-foreground text-sm'>
            • Do not share your code to anyone.
          </p>
          <p className='text-muted-foreground mt-3 sm:mt-0 text-sm'>
            • This link only available for only 24hrs.
          </p>

          <div className='flex justify-center items-center mt-5'>
            <Button
              type='submit'
              className='w-[50%] bg-blue-600 hover:bg-blue-700 text-white'
              onClick={handleSubmit}
            >
              Verify
            </Button>
          </div>
        </>
      ) : null}
    </CardWrapper>
  );
};

export default VerificationForm;
