'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface FriendsType{
  username: string,
  name: string,
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  username: string;
  tasks: string[];
  friends: FriendsType[];
  groups: string[]
  // Add other user properties as needed
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  token: string;
  setToken: (token: string) => void;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode;} ) {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string >("");

  console.log("user Context Data: ", user)

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
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