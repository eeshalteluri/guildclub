'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserType {
  name: string;
  username: string;
  // Add other user properties as needed
}

export interface RequestType {
 receivedRequests:  UserType [],
 sentRequests:  UserType [],
  // Add other user properties as needed
}

interface RequestContextType {
  requests: RequestType | null;
  setRequests: (requests: RequestType | null) => void;
}


const RequestsContext = createContext<RequestContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<RequestType | null>(null);

  return (
    <RequestsContext.Provider value={{ requests, setRequests }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 