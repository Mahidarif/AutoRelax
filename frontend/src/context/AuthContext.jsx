import { createContext, useContext, useReducer } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { user: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('userInfo');
      return { user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  });

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    dispatch({ type: 'LOGIN', payload: data });
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    dispatch({ type: 'LOGIN', payload: data });
    return data;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  const updateProfile = async (userData) => {
    const { data } = await api.put('/users/profile', userData);
    dispatch({ type: 'LOGIN', payload: data });
    return data;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
