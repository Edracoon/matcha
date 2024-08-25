import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/authProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
	<BrowserRouter>
      <AuthProvider>
		<APIProvider apiKey={"AIzaSyDUDV6IZYeo0uoRMQhC4dza6C7bpYkn7EM"}>
          <App />
		</APIProvider>
      </AuthProvider>
	</BrowserRouter>
//   </React.StrictMode>
)
