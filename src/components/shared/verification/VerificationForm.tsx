'use client';
import React, {
  ChangeEvent,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import CardWrapper from '../CardWrapper';
import { PulseLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  VerificationTokenSignUp,
} from '@/actions/verification.actions';
import { FormError } from '../FormError';
import { FormSuccess } from '../FormSuccess';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  handleChange,
  handlePaste,
} from '@/hook/verification/VerificationInputEvents';
import { makeToastError } from '@/lib/helpers/makeToast';
import { calculateRemainingTime, formatTime } from '@/lib/utils';

const VerificationForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [header, setHeader] = useState<string | undefined>('');
  const [labelLink, setLabelLink] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputCode, setInputCode] = useState<string[]>(Array(6).fill(''));
  const [tokenEmail, setTokenEmail] = useState<any>(null);
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
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
  }, [token, loading]);

  useEffect(() => {
    checkToken();
  }, [checkToken, tokenEmail])

  useEffect(() => {
    if (inputRefs.current.length !== inputCode.length) {
      inputRefs.current = Array(inputCode.length)
        .fill(null)
        .map((_, i) => inputRefs.current[i] || createRef<HTMLInputElement>());
    }

    if (expirationTime) {
      const initialSeconds = calculateRemainingTime(expirationTime);
      setSecondsRemaining(initialSeconds);
    }

    if (secondsRemaining <= 0) {
      setIsPending(true);
      setLabelLink('Resend Verification Code');
      return;
    } else {
      setIsPending(false);
      setLabelLink('');
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prevSeconds) => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [inputCode.length, secondsRemaining,expirationTime, ]);
  
  const handleSubmit = async () => {
    try {
      const verificationCode = inputCode.join('');
      if (verificationCode.length !== 6)
        return makeToastError('Please complete the verification code.');
      setLoading(true);
      const data = {
        email: tokenEmail,
        verificationCode: verificationCode,
      };
      const response = await fetch('/api/auth/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (!response.ok) {
        makeToastError(res.error);
        setLoading(false);
      } else {
        setLoading(false);
        setLabelLink('');
        setSuccess('Verification completed!');
        router.push('/sign-in');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onResendCode = async () => {
    try {
      const data = {
        email: tokenEmail,
      };
      const response = await fetch('/api/auth/verification/resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (!response.ok) {
        throw new Error('Failed to resend verification code', res.error);
      }
      console.log(res);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CardWrapper
      headerLabel={header || 'Please double check your token or sign up again.'}
      backButtonHref=''
      backButtonLabel={labelLink}
      onResendCode={onResendCode}
    >
      {expirationTime && !success && (
        <div className='flex items-center justify-center'>
          <div className='text-center rounded-md mb-[3%] sm:text-3xl text-xl font-medium'>
            {formatTime(secondsRemaining)}
          </div>
        </div>
      )}
      <div className='flex items-center justify-center sm:p-5 p-0 gap-2 sm:gap-4'>
        {!error && !success && loading && (
          <PulseLoader className='text-sm gap-2 p-5' />
        )}
        {!error && !loading && !success
          ? inputCode.map((value, index) => (
              <Input
                key={index}
                disabled={isPending}
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
              disabled={isPending || labelLink == null}
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
