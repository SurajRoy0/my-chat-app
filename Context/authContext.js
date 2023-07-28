const { createContext, useState, useContext, useEffect } = require("react");

import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const clear = () => {
        setCurrentUser(null)
        setIsLoading(false);
    }
    const authStateChanged = async (user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }
        const userDoc = await getDoc(doc(db, "users", user.uid))
        setCurrentUser(userDoc.data())
        setIsLoading(false);
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