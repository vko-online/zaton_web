import { Button, TextInput, TextInputField, Pane, Heading } from 'evergreen-ui'
import firebase from 'firebase/app'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from 'src/services/auth'
import { useHistory } from 'react-router-dom'
import background from './header_background.png'

export default function Page () {
  const auth = useAuth()
  const history = useHistory()
  const [email, setEmail] = useState<string>('')
  async function handleLogin () {
    try {
      await auth.signin(email)
      alert('Email sent')
    } catch (e) {
      console.log('handleLogin', e)
    }
  }

  const init = useCallback(async () => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      const storedEmail = window.localStorage.getItem('emailForSignIn')
      if (!storedEmail) {
        console.log('different device')
      }
      if (storedEmail) {
        try {
          const result = await firebase.auth().signInWithEmailLink(storedEmail, window.location.href)
          auth.setUser(result.user)
          window.localStorage.removeItem('emailForSignIn')
          history.push('/')
        } catch (e) {
          console.log('init', e)
        }
      }
    }
  }, [auth, history])
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init()
  }, [init])

  return (
    <Pane flex={1} backgroundSize='cover' backgroundImage='url("header_background.png")' display='flex' justifyContent='center' alignItems='center'>
      <Pane paddingX={100} paddingY={60} background='#e6f9ff' borderRadius={10}>
        <Heading size={800} textAlign='center' marginBottom='50'>Беспарольная авторизация</Heading>
        <Pane display='flex' alignSelf='flex-end' alignItems='center' width={500}>
          <TextInputField description='Отправим ссылку для доступа' value={email} onChange={e => setEmail(e.target.value)} width='100%' height={48} placeholder='Введите ваш Email' />
          <Button disabled={!email} onClick={handleLogin} height={48} appearance='primary' marginLeft={16}>Отправить</Button>
        </Pane>
      </Pane>
    </Pane>
  )
}
