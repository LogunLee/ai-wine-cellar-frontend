import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import LazyPage from './LazyPage'

const LoginPage = LazyPage(() => import('../pages/LoginPage'))
const RegisterPage = LazyPage(() => import('../pages/RegisterPage'))
const DashboardPage = LazyPage(() => import('../pages/DashboardPage'))
const CellarPage = LazyPage(() => import('../pages/CellarPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'cellar',
        element: <CellarPage />,
      },
    ],
  },
])
