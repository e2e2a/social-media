"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const Users = ({ initialUsers }: { initialUsers: any }) => {
  const { data: users, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => initialUsers,
    initialData: initialUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      {users && users.map((user: any) => (
        <div key={user.id}>
          <h1>{user.firstname}</h1>
          <h1>{user.lastname}</h1>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
