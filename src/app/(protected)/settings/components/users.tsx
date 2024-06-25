"use client"
import React from 'react';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

const Users = () => {
  const fetchData = async () => {
    try {
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
      return data; // Assuming your API response is an array of users
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch users');
    }
  };
  const { data, error, isLoading }: UseQueryResult<any, Error> = useQuery({
    queryKey: ['users'], // Specify a unique key for this query
    queryFn: fetchData, // Pass fetchData directly as the function to execute for fetching data
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
    </div>
  );
};

export default Users;
