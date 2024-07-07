"use client"
import React, { useEffect, useState } from 'react';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

const Users = (session:any) => {
  // const { data: session } = useSession();
  console.log(session);
  const fetchData = async () => {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  
  };
  const { data, error, isLoading }: UseQueryResult<any, Error> = useQuery({
    queryKey: ['users'], 
    queryFn: fetchData,
    // staleTime: 0,
    // refetchInterval: 5 * 1000,
  });
  console.log(data)
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  return (
    
    <div>
      {data && data.users?.map((user: any) => (
        <div key={user.id}>
          <h1>{user.firstname}</h1>
          <h1>{user.lastname}</h1>
          <p>{user.email}</p>
        </div>
      ))}
      <div >
          <p>this is {session?.session.email}</p>
        </div>
    </div>
  );
};

export default Users;
