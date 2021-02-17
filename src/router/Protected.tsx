import { useEffect, useState } from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import firebase from 'firebase/app'

export default function ProtectedRoute ({ children, ...rest }) {
  const currentUser = firebase.auth().currentUser
  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/auth',
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}
