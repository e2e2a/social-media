// Import statements
"use client"
import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const LogoutComponents = () => {
  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
      await signOut({ callbackUrl: '/sign-in' }); 
    }

  return (
    <div>
      <form>
        <Button type="button" onClick={handleLogout}>Sign Out</Button>
      </form>
    </div>
  );
};

export default LogoutComponents;
