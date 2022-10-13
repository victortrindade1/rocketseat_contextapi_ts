import React, {createContext} from 'react';
import * as auth from '../services/auth';

interface IAuthProvider {
  children: React.ReactNode;
}

interface AuthContextData {
  signed: boolean;
  user: object;
  signIn(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<IAuthProvider> = ({
  children,
}: IAuthProvider) => {
  async function signIn() {
    const response = await auth.signIn();

    console.log(response);
  }

  return (
    <AuthContext.Provider value={{signed: false, user: {}, signIn}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
