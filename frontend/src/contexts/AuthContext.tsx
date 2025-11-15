import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profileImage?: string;
  contactDetails?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  addUser: (newUser: Omit<User, 'id'>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  isAdmin: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users as specified
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin@123',
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    email: 'user@gmail.com',
    password: 'user@123',
    role: 'user',
  },
  {
    id: '3',
    username: 'demo',
    email: 'demo@gmail.com',
    password: 'demo@123',
    role: 'user',
  },
  
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount - check both localStorage and sessionStorage
    const storedUser = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    const storedUsers = localStorage.getItem('app_users');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      if (rememberMe) {
        localStorage.setItem('auth_user', JSON.stringify(foundUser));
      } else {
        sessionStorage.setItem('auth_user', JSON.stringify(foundUser));
      }
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    if (!isAdmin() && user?.id !== userId) {
      return false;
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    // Update current user if editing self
    if (user?.id === userId) {
      const updatedCurrentUser = { ...user, ...updates };
      setUser(updatedCurrentUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedCurrentUser));
    }
    
    return true;
  };

  const addUser = async (newUser: Omit<User, 'id'>): Promise<boolean> => {
    if (!isAdmin()) {
      return false;
    }

    const userWithId = {
      ...newUser,
      id: Date.now().toString(),
    };
    
    const updatedUsers = [...users, userWithId];
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    return true;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!isAdmin() || userId === '1') { // Prevent deleting main admin
      return false;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, updateUser, addUser, deleteUser, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
