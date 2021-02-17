import React, { useState, useEffect, useContext, createContext } from 'react'
import firebase from 'firebase/app'

interface AuthService {
  user: firebase.User | null
  setUser: (u: firebase.User) => void
  signin: (e: string) => Promise<firebase.User>
  signout: () => Promise<void>
}
const AuthContext = createContext<AuthService>({
  setUser: () => null,
  signin: () => null,
  signout: () => null,
  user: null
})

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth ({ children }) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext)
}

// Provider hook that creates auth object and handles state
function useProvideAuth () {
  const [user, setUser] = useState<firebase.User | null>(null)

  const signin = async (email) => {
    const actionCodeSettings = {
      url: window.location.href, // Here we redirect back to this same page.
      handleCodeInApp: true // This must be true.
    }
    try {
      await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
      window.localStorage.setItem('emailForSignIn', email)
      return true
    } catch (e) {
      console.log('handleLogin', e)
      return e
    }
  }

  const signout = async () => {
    return await firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null)
      })
  }

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Return the user object and auth methods
  return {
    setUser,
    signin,
    user,
    signout
  }
}
