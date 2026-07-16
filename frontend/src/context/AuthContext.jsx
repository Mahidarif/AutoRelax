import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      sessionStorage.setItem('userInfo', JSON.stringify(action.payload));
      return { ...state, user: action.payload, loading: false };
    case 'LOGOUT':
      sessionStorage.removeItem('userInfo');
      return { ...state, user: null, loading: false };
    case 'FINISH_LOADING':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null,
    loading: !sessionStorage.getItem('userInfo'),
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'request_session' && sessionStorage.getItem('userInfo')) {
        localStorage.setItem('share_session', sessionStorage.getItem('userInfo'));
        localStorage.removeItem('share_session');
      } else if (e.key === 'share_session' && e.newValue && !sessionStorage.getItem('userInfo')) {
        const userInfo = JSON.parse(e.newValue);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        dispatch({ type: 'LOGIN', payload: userInfo });
      }
    };

    window.addEventListener('storage', handleStorage);

    if (!sessionStorage.getItem('userInfo')) {
      localStorage.setItem('request_session', Date.now());
      const timer = setTimeout(() => {
        localStorage.removeItem('request_session');
        dispatch({ type: 'FINISH_LOADING' });
      }, 150);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('storage', handleStorage);
      };
    } else {
      return () => {
        window.removeEventListener('storage', handleStorage);
      };
    }
  }, []);

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
