import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation
} from 'react-router-dom'
import { Pane, Button } from 'evergreen-ui'
import firebase from 'firebase/app'
import Nav from './Nav'

import ProtectedRoute from 'src/router/Protected'

import Home from 'src/pages/Home'
import Auth from 'src/pages/Auth'
import Clients from 'src/pages/Clients'
import Offers from 'src/pages/Offers'
import Products from 'src/pages/Products'
import Profile from 'src/pages/Profile'
import { useEffect, useCallback } from 'react'
import { useAuth } from 'src/services/auth'

export default function App () {
  const auth = useAuth()

  async function handleLogout () {
    await auth.signout()
  }
  return (
    <Router>
      <div className='root'>
        <Pane display='flex' flexDirection='row'>
          <Nav exact to='/' label='Home' />
          <Nav exact to='/offers' label='Offers' />
          <Nav exact to='/clients' label='Clients' />
          <Nav exact to='/products' label='Products' />
          <Pane flex={1} />
          {/* <Nav exact to='/profile' label='Profile' /> */}
          {
            auth.user && <Button onClick={handleLogout}>Logout</Button>
          }
        </Pane>
        <div className='flex'>
          <Switch>
            <Route path='/auth'>
              <Auth />
            </Route>
            <ProtectedRoute path='/offers'>
              <Offers />
            </ProtectedRoute>
            <ProtectedRoute path='/clients'>
              <Clients />
            </ProtectedRoute>
            <ProtectedRoute path='/products'>
              <Products />
            </ProtectedRoute>
            <ProtectedRoute path='/profile'>
              <Profile />
            </ProtectedRoute>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}
