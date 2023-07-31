
import useAuth from '@/Context/authContext';
import LeftNav from '@/components/Header/LeftNav';
import Loader from '@/components/Loader/Loader';
import Chats from '@/components/chats/Chats';
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
    <div className='bg-c1 flex h-[100vh]'>
      <div className='flex w-full shrink-0'>
        <LeftNav />
        <div className='flex bg-c2 grow'>
          <div className='w-[420px] p-5 overflow-auto scrollbar shrink-0 border-r border-white/[0.05]'>
            <div className='flex flex-col h-full'>
              <Chats />
            </div>
          </div>
          <div>Chats</div>
        </div>
      </div>
    </div>
  )
}

export default Home;