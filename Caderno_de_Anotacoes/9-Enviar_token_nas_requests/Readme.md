# Enviar o token nas requests

Instale o axios.

`yarn add axios`

## src/services/api.ts

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default api;
```

## src/contexts/auth.tsx

```diff
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import * as auth from '../services/auth';
+import api from '../services/api';

interface IAuthProvider {
  children: React.ReactNode;
}

interface AuthContextData {
  signed: boolean;
  user: object | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<IAuthProvider> = ({children}) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      // Depois pra melhorar, use o multiGet pra fazer esses 2 asyncs juntos
      const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
      const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        setLoading(false);

+        api.defaults.headers.common.Authorization = `Bearer ${storagedToken}`;
      }
    }

    loadStoragedData();
  }, []);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);

+    api.defaults.headers.common.Authorization = `Bearer ${response.token}`;

    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@RNAuth:token', response.token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider
      value={{signed: !!user, user, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```
