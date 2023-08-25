import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoLogoGoogle } from "react-icons/io";
import { auth } from "@/firebase/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import useAuth from "@/Context/authContext";
import { useRouter } from "next/router";
import ToastMessage from "@/components/alerts/ToastMessage";
import { toast } from "react-toastify";
import Loader from "@/components/Loader/Loader";

const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const [email, setEmail] = useState("");
  const { isLoading, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/");
    }
  }, [isLoading, currentUser]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    if (email === "" || password.length < 7) {
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
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


  const resetPasswordHandler = async () => {
    try {
      toast.promise(
        async () => {
          await sendPasswordResetEmail(auth, email);
        },
        {
          pending: "Generating reset link",
          success: "Reset link sent to your email",
          error: "you may have entered wrong email id",
        },
        {
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="h-screen flex justify-center items-center bg-c1">
      <ToastMessage />
      <div className="flex items-center flex-col w-full p-5">
        <div className="text-center mb-5">
          <div className="text-4xl font-bold">Login To Your Account</div>
          <div className="mt-3 text-c3">Chat with anyone, anytime and anywhere</div>
        </div>
        <div className="flex w-full md:max-w-md">
          <div
            onClick={signInWithGoogle}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-14 rounded-md cursor-pointer p-[1px]"
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
        <form onSubmit={submitHandler} action="" className="flex flex-col gap-3 w-full md:max-w-md">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <div className="text-right w-full text-c3">
            <span onClick={resetPasswordHandler} className="cursor-pointer">
              Forgot Password?
            </span>
          </div>
          <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Login To Your Account
          </button>
        </form>
        <div className="flex justify-center gap-1 text-c3 mt-5">
          <span>Are You New Here? </span>
          <Link href="/register" className="font-semibold text-white underline underline-offset-2 cursor-pointer">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
