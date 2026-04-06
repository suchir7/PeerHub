import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './styles/global.css'

const googleClientId = (
  import.meta.env.VITE_GOOGLE_CLIENT_ID
  || import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
  || ''
).trim()

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      {app}
    </GoogleOAuthProvider>
  ) : (
    app
  ),
)
