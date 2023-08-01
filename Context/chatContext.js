import { createContext, useState, useContext, useEffect, useReducer } from "react";
import useAuth from "./authContext";


const ChatContext = createContext();


export const ChatContextProvider = ({ children }) => {
    const [users, setUsers] = useState(null)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)

    const { currentUser } = useAuth();

    const INITIAL_STATE = {
        chatId: "",
        user: null
    }

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

    return (<ChatContext.Provider value={{ users, setUsers, data: state, dispatch, chats, setChats, selectedChat, setSelectedChat }}>
        {children}
    </ChatContext.Provider>)
}

const useChatContext = () => useContext(ChatContext);
export default useChatContext;