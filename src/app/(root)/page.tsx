// import { Models } from "appwrite";
"use client"
// import { useToast } from "@/components/ui/use-toast";
// import { Loader, UserCard } from "@/components/shared";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
// import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";

const Home = () => {
  // const { toast } = useToast();

//   const {
//     data: posts,
//     isLoading: isPostLoading,
//     isError: isErrorPosts,
//   } = useGetRecentPosts();
//   const {
//     data: creators,
//     isLoading: isUserLoading,
//     isError: isErrorCreators,
//   } = useGetUsers(10);

//   if (isErrorPosts || isErrorCreators) {
//     return (
//       <div className="flex flex-1">
//         <div className="home-container">
//           <p className="body-medium text-light-1">Something bad happened</p>
//         </div>
//         <div className="home-creators">
//           <p className="body-medium text-light-1">Something bad happened</p>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {/* {isPostLoading && !posts ? (
            <Loader />
          ) : ( */}
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {/* {posts?.documents.map((post: Models.Document) => ( */}
                {/* <li key={post.$id} className="flex justify-center w-full"> */}
                <li className="flex justify-center w-full">
                  {/* <PostCard post={post} /> */}
                  <PostCard />
                </li>
              {/* ))} */}
            </ul>
          {/* )} */}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {/* {isUserLoading && !creators ? (
          <Loader />
        ) : ( */}
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {/* {creators?.documents.map((creator) => ( */}
              {/* <li key={creator?.$id}> */}
              <li >
                {/* <UserCard user={creator} /> */}
                <UserCard />
              </li>
            {/* ))} */}
          </ul>
        {/* )} */}
      </div>
    </div>
  );
};

export default Home;








// import SignInButton from '@/components/shared/auth/SignInButton';
// import { Button } from '@/components/ui/button';
// import { cn, fontPoppins } from '@/lib/utils';

// export default function Home() {
//     const click = () => {
//         const modee = 'modal'
//         mode: modee
//     }
//   return (
//     <main className='flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
//       <div className='space-y-6 text-center'>
//         <h1
//           className={cn(
//             'text-6xl font-semibold text-white drop-shadow-md',
//             fontPoppins.className
//           )}
//         >
//           🔐 Auth
//         </h1>
//         <p className='text-white text-lg'>
//           A simple authentication service
//         </p>
//         <div className=''>
//           <SignInButton>
//             <Button variant='secondary' size='lg'>
//               Sign In
//             </Button>
//           </SignInButton>
//         </div>
//       </div>
//     </main>
//   );
// }
