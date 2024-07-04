'use client';
import React from 'react';
import Users from './components/users';
import LogoutComponents from './components/logout';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
async function myFunction() {
  const session = await getSession();
  /* ... */
  return session;
}
const SettingsPage = () => {
  const session = myFunction();
  const router = useRouter();
  // const session = await auth();
  // const users = await getUsers()
  // const fetchData = async () => {
  //   try {
  //     /**
  //      * @todo
  //      * get the apikey to the server then compare it
  //      */
  //     const response = await fetch('/api/users', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
  //         // Add any other headers as needed
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     return data
  //     // console.log(data); // Log the fetched data
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  // useEffect(() => {

  //   fetchData().then((data) => {
  //     console.log(data)
  //     setUsers(data.users);
  //   }).catch(error => {
  //     console.error('Error fetching data:', error);
  //   }); // Call fetchData function when the component mounts
  // }, []); // Empty dependency array means this effect runs only once after initial render
  if (!session) {
    return router.push('/mypushrouter');
  }
  session.then((data) => {
    console.log('data', data)
  })
  return (
    <div>
      <Users />
      {/* {users &&
        users.map((user: any) => (
          <div key={user.id}>
            <h1>{user.firstname}</h1>
            <h1>{user.lastname}</h1>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p>break</p>
          </div>
        ))} */}
      {/* {JSON.stringify(session)} */}
      {/* <Users initialUsers={users}/> */}
      <LogoutComponents />
    </div>
  );
};

export default SettingsPage;
