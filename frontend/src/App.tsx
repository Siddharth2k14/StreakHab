import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage/AuthPage'
import LoginPage from './components/Login/page'
import RegisterPage from './components/Register/page'

import "./App.css"
import HomePage from './pages/HomePage/HomePage'
// import TrackerPage from "./pages/TrackerPage/TrackerPage"

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/auth' element={<AuthPage />}>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
      </Route>
    </Routes>

    // <div>
    //   <HomePage />
    // </div>
  )
}

export default App