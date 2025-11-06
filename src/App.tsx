import { Route, Routes } from 'react-router-dom'
import './global.css'
import AuthLayout from './_auth/AuthLayout.tsx'
import SigninForm from './_auth/forms/SigninForm.tsx'
import SignupForm from './_auth/forms/SignupForm.tsx'
import RootLayout from './_root/RootLayout.tsx'
import Home from './_root/pages/Home.tsx'
import { Toaster } from 'sonner'
import Files from './_root/pages/Files.tsx'


export default function App() {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        {/* Private Routes */}
        <Route path='/' element={<RootLayout />} >
          <Route index element={<Home />} />
          <Route path='files' element={<Files/>} />
        </Route>
      </Routes>
      <Toaster/>
    </main>
  )
}


