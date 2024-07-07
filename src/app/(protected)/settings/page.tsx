import React from 'react';
import Users from './components/users';
import LogoutComponents from './components/logout';
import { auth } from '@/auth';

const SettingsPage = async() => {
  const session1 = await auth()
  console.log('session1', session1?.user)
  return (
    <div>
      <Users session={session1?.user}/>
      
      <LogoutComponents />
    </div>
  );
};

export default SettingsPage;
