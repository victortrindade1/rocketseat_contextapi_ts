import React, {createContext, useState} from 'react';
import * as auth from '../services/auth';

interface IAuthProvider {
  children: React.ReactNode;
}

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<IAuthProvider> = ({children}) => {
  const [user, setUser] = useState<object | null>(null);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);
  }

  async function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{signed: !!user, user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
