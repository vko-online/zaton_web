import Router from 'src/router'
import { ProvideAuth } from 'src/services/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'firebase/app'

export default function App () {
  const [user, loading, error] = useAuthState(firebase.auth())

  if (loading) {
    return null
  }

  return (
    <ProvideAuth>
      <Router />
    </ProvideAuth>
  )
}
