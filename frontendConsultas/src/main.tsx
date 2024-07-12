import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { RouterProvider } from 'react-router-dom'
import { routerConfig } from '@routes/RouterConfig'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider style={{ height : "100%"}}>
      <RouterProvider router={routerConfig} />
    </NextUIProvider>
  </React.StrictMode>,
)
