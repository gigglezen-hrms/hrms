import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage or API
  useEffect(() => {
    const loadUser = () => {
      const accessToken = localStorage.getItem('accessToken');
      const cachedUser = localStorage.getItem('user');

      console.log('AuthContext: Loading user', { hasToken: !!accessToken, hasUser: !!cachedUser });

      if (accessToken && cachedUser) {
        try {
          const userData = JSON.parse(cachedUser);
          console.log('AuthContext: User loaded', userData);
          setUser(userData);
        } catch (e) {
          console.error('Failed to parse cached user', e);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    loadUser();

    // Listen for storage changes (login from another tab, etc)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'accessToken') {
        console.log('AuthContext: Storage changed, reloading user');
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedEmail');
  };

  const hasRole = (roleId: string): boolean => {
    if (!user) return false;
    return user.role.toLowerCase() === roleId.toLowerCase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
