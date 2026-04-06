import { useState } from 'react';

const TOKEN_KEY = 'zorvyn_token';
const ROLE_KEY = 'zorvyn_role';

function useToken() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || '');

  const setAuth = (nextToken, nextRole = '') => {
    setToken(nextToken || '');
    setRole(nextRole || '');

    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextRole) {
      localStorage.setItem(ROLE_KEY, nextRole);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }
  };

  const clearAuth = () => {
    setAuth('', '');
  };

  return {
    token,
    role,
    setAuth,
    clearAuth,
    isAuthenticated: Boolean(token),
  };
}

export default useToken;
