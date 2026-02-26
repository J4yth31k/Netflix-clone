import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
const AppRouter = () => { const { user } = useAuth(); return user ? <Home /> : <Login />; };
export default AppRouter;
