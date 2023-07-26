
import useAuth from '@/Context/authContext';
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
  return (
    <div>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

export default Home;