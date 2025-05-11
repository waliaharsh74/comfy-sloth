import React, { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { LogoutOptions, RedirectLoginOptions, User as Auth0User } from '@auth0/auth0-react';

interface UserContextType {
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
  logout: (options?: LogoutOptions) => void;
  myUser: Auth0User | null;
  isLoading: boolean;
  error: Error | undefined;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loginWithRedirect, logout, user, isLoading, error } = useAuth0();
  const [myUser, setMyUser] = useState<Auth0User | null>(null);

  useEffect(() => {
    setMyUser(user ?? null);
  }, [user]);

  return (
    <UserContext.Provider value={{ loginWithRedirect, logout, myUser, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used within UserProvider');
  return context;
};
