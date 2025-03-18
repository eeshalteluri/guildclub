'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FriendsType {
  username: string;
  name: string;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  username: string;
  tasks: string[];
  friends: FriendsType[];
  groups: string[];
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  token: string;
  setToken: (token: string) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true); // New state to track initialization

  console.log("User Context Data before: ", user);
  console.log("Token Data before: ", token);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false); // Mark as initialized
  }, []);

  console.log("User Context Data after: ", user);
  console.log("Token Data after: ", token);

  

  useEffect(() => {
    if (token !== '') {
      localStorage.setItem('token', token);
    } 
  }, [token]);

  useEffect(() => {
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
