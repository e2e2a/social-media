// Import statements
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const LogoutComponents = () => {
  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
      await signOut({ callbackUrl: '/' }); // Redirect after sign out
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
