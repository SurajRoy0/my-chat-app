
import useAuth from '@/Context/authContext';
import LeftNav from '@/components/Header/LeftNav';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const Home = () => {
  const { signOut, isLoading, currentUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if ((!isLoading && !currentUser)) {
      router.push("/sign-in");
    }
  }, [isLoading, currentUser]);
  return !currentUser ? <Loader /> : (
    // <div>
    //   <button onClick={() => signOut()}>Sign Out</button>
    // </div>

    <div className='bg-c1 flex h-[100vh]'>
      <div className='flex w-full shrink-0'>
        <LeftNav />
        <div className='flex bg-c2 grow'>
          <div>side bar</div>
          <div>Chats</div>
        </div>
      </div>
    </div>
  )
}

export default Home;