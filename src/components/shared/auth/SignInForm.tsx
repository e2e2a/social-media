'use client';
import React, { useState, useTransition } from 'react';
import CardWrapper from './CardWrapper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SigninValidator } from '@/lib/validators/Validator';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '../FormError';
import { FormSuccess } from '../FormSuccess';
import { SignInAction } from '@/actions/auth.actions';
import { useSearchParams } from 'next/navigation';

const SignInForm = () => {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ? "Email Error provider" : ""
  const [error, setError] = useState<string | undefined>('');
  // const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SigninValidator>>({
    resolver: zodResolver(SigninValidator),
    // this default valueis for input errors message
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = (data: z.infer<typeof SigninValidator>) => {

    startTransition(() => {
      SignInAction(data).then((res) => {
        setError(res?.error);
        // setSuccess(res?.success)
      });
    });
  };
  return (
    <CardWrapper
      headerLabel='Welcome Back'
      backButtonHref='/sign-up'
      backButtonLabel="Don't have an account?"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {/*
             * @todo
             */}
            <FormError message={error || urlError} />
            {/* <FormSuccess message={success} /> */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='example@gmail.com'
                      type='email'
                      className='bg-gray-50'
                    />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='********'
                      type='password'
                      className='bg-gray-50'
                    />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
            Sign In
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignInForm;
