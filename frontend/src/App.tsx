import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ROUTES } from './constants/routes'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Groceries from './pages/Groceries'
import Expenses from './pages/Expenses'
import Bills from './pages/Bills'
import Reminders from './pages/Reminders'
import Family from './pages/Family'
import Documents from './pages/Documents'

import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/common/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          
          <Route path={ROUTES.DASHBOARD} element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path={ROUTES.GROCERIES} element={<PrivateRoute><Groceries /></PrivateRoute>} />
          <Route path={ROUTES.EXPENSES} element={<PrivateRoute><Expenses /></PrivateRoute>} />
          <Route path={ROUTES.BILLS} element={<PrivateRoute><Bills /></PrivateRoute>} />
          <Route path={ROUTES.REMINDERS} element={<PrivateRoute><Reminders /></PrivateRoute>} />
          <Route path={ROUTES.FAMILY} element={<PrivateRoute><Family /></PrivateRoute>} />
          <Route path={ROUTES.DOCUMENTS} element={<PrivateRoute><Documents /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
