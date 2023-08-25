import Link from "next/link";
import React, { useEffect } from "react";

import { IoLogoGoogle } from "react-icons/io";

import { auth, db } from "@/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import useAuth from "@/Context/authContext";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";

import { profileColors } from "@/utils/constant";
import Loader from "@/components/Loader/Loader";

const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const { isLoading, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/");
    }
  }, [isLoading, currentUser]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const randomColorIndex = Math.floor(Math.random() * profileColors.length);
    if (name == "" || email == "" || password.length < 7) {
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email,
        color: profileColors[randomColorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, {
        displayName: name,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-screen flex justify-center items-center bg-c1">
      <div className="flex items-center flex-col w-full p-5">
        <div className="text-center">
          <div className="text-4xl font-bold">Create New Account</div>
          <div className="mt-3 text-c3">
            Chat with anyone, anytime and anywhere
          </div>
        </div>
        <div className="flex w-full md:max-w-md">
          <div
            onClick={signInWithGoogle}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 w-full to-pink-500 h-14 rounded-md cursor-pointer p-[1px]"
          >
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
              <IoLogoGoogle size={24} />
              <span>Sign Up With Google</span>
            </div>
          </div>
        
        </div>
        <div className="flex items-center gap-1">
          <span className="w-5 h-[1px] bg-c3"></span>
          <span className="text-c3 font-semibold">OR</span>
          <span className="w-5 h-[1px] bg-c3"></span>
        </div>
        <form
          onSubmit={submitHandler}
          action=""
          className="flex flex-col items-center gap-3 w-full md:max-w-md mt-5"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
            Create Account
          </button>
        </form>
        <div className="flex justify-center gap-1 text-c3 mt-5">
          <span>Already have an account? </span>
          <Link
            href="/sign-in"
            className="font-semibold text-white underline underline-offset-2 cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
