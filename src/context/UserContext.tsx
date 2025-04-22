import React, { createContext, useState, useEffect, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { fetchUsers, User } from '@/lib/api';

// Re-introduce Admin Email Definition
const ADMIN_EMAIL = "admin@example.com"; // Should match seed.ts

interface UserContextType {
  users: User[];
  selectedUserId: string | null;
  setSelectedUserId: Dispatch<SetStateAction<string | null>>;
  loadingUsers: boolean;
  userError: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setUserError(null);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
        const adminUser = fetchedUsers.find(user => user.email === ADMIN_EMAIL);
        setSelectedUserId(adminUser ? adminUser.id : null);
      } catch (err) {
        console.error("Error fetching users for context:", err);
        setUserError("Failed to load users.");
        setUsers([]); // Ensure users is empty on error
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, selectedUserId, setSelectedUserId, loadingUsers, userError }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}; 