const { createContext, useState, useContext, useEffect } = require("react");

import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const clear = () => {
        setCurrentUser(null)
        setIsLoading(false);
    }
    const authStateChanged = (user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }
        setCurrentUser(user)
        setIsLoading(false);
        console.log(user)
    }

    const signOut = async () => {
        try {
            await authSignOut(auth)
            clear();
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged)
        return () => unsubscribe();
    }, [])


    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                isLoading,
                setIsLoading,
                signOut
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

const useAuth = () => useContext(UserContext);
export default useAuth;