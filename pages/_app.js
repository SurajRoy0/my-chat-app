import { UserProvider } from '@/Context/authContext'
import { ChatContextProvider } from '@/Context/chatContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <ChatContextProvider>
        <Component {...pageProps} />
      </ChatContextProvider>
    </UserProvider>
  )
}
