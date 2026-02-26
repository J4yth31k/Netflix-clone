import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './AppRouter';
const App = () => (<AuthProvider><AppRouter /></AuthProvider>);
export default App;
