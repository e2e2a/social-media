import { z } from 'zod';
import { NewPasswordValidator, SigninValidator, SignupValidator } from './validators/Validator';
import { QueryFunctionContext } from '@tanstack/react-query';

// ============================================================
// AUTH fetch
// ============================================================
export const fetchSignUp = async (data: z.infer<typeof SignupValidator>) => {
  const response = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to sign up. Please try again.');
  }
  return res;
};

export const fetchSignIn = async (data: z.infer<typeof SigninValidator>) => {
  const response = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to sign in. Please try again.');
  }

  return res;
};

interface data {
  email: string;
  verificationCode?: string;
}

export const fetchVerficationCode = async (data: data) => {
  const response = await fetch('/api/auth/verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to sign in. Please try again.');
  }

  return res;
};

export const fetchResendVCode = async (data: data) => {
  const response = await fetch('/api/auth/verification/resend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to sign in. Please try again.');
  }

  return res;
};

export const fetchRecoveryEmail = async (data: data) => {
  const response = await fetch('/api/auth/recovery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to find the email. Please try again.');
  }

  return res;
};

interface tokenCheck {
  token: string;
}

export const fetchTokenEmail = async ({ queryKey }: QueryFunctionContext) => {
  const [_key, data] = queryKey as [string, tokenCheck];
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to check token.');
  }

  return res;
};

// ============================================================
// AUTH Recovery
// ============================================================

export const fetchRecoveryTokenEmail = async ({ queryKey }: QueryFunctionContext) => {
  const [_key, data] = queryKey as [string, tokenCheck];
  const response = await fetch('/api/token/reset-password-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to check token.');
  }

  return res;
};

export const fetchNewPassword = async (data: z.infer<typeof NewPasswordValidator>) => {
  const response = await fetch('/api/auth/recovery/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || 'Failed to sign up. Please try again.');
  }
  return res;
};