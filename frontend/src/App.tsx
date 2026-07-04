import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Groceries from './pages/Groceries'
import Expenses from './pages/Expenses'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.GROCERIES} element={<Groceries />} />
        <Route path={ROUTES.EXPENSES} element={<Expenses />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
