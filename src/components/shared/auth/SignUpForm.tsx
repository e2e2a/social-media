'use client';
import React, { useState, useTransition } from 'react';
import CardWrapper from './CardWrapper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { SignupValidator } from '@/lib/validators/Validator';
import { SignUpAction } from '@/actions/auth.actions';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof SignupValidator>>({
    resolver: zodResolver(SignupValidator),
    // this default valueis for input errors message
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      CPassword: '',
    },
  });
  const onSubmit = (data: z.infer<typeof SignupValidator>) => {
    startTransition(async () => {
      await SignUpAction(data).then((res) => {
        if (res.error) return setError(res.error);

        setSuccess(res.success);
        router.push(`/verification?token=${res.token}`);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel='Create an Account'
      backButtonHref='/sign-in'
      backButtonLabel='Already have an account?'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {/*
             * @todo
             */}
            <FormError message={error} />
            <FormSuccess message={success} />
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
              name='firstname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='Enter Firstname'
                      className='bg-gray-50'
                    />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='Enter Lastname'
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
            <FormField
              control={form.control}
              name='CPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
          <Button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          >
            Sign Up
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignUpForm;
