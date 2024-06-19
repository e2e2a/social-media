import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/helpers/logout';
import React from 'react';

const LogoutComponents = () => {
  return (
    <form
      action={logout}
    >
      <Button type='submit'>Sign Out</Button>
    </form>
  );
};

export default LogoutComponents;
