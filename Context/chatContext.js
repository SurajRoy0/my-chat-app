import { createContext, useState, useContext, useEffect, useReducer } from "react";
import useAuth from "./authContext";


const ChatContext = createContext();

const INITIAL_STATE = {
    chatId: "",
    user: null
}



export const ChatContextProvider = ({ children }) => {
    const [users, setUsers] = useState(null)
    const { currentUser } = useAuth();

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
                }

            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (<ChatContext.Provider value={{ users, setUsers, data: state, dispatch }}>
        {children}
    </ChatContext.Provider>)
}

const useChatContext = () => useContext(ChatContext);
export default useChatContext;