# Persistir usuário logado

Pra persistir o usuário logado, não é necessário backend. Vou salvar os dados do usuário no storage do dispositivo. Pra RN, usa-se o `async storage`, e pra ReactJS usa-se `local storage` (mais simples de usar).

Pra usar async storage, instale a lib:

`yarn add @react-native-community/async-storage`

`cd ios` `podinstall`

## src/contexts/auth.tsx

```diff
-import React, {createContext, useState} from 'react';
+import React, {createContext, useState, useEffect} from 'react';

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

+  useEffect(() => {
+    async function loadStoragedData() {
+      // Depois pra melhorar, use o multiGet pra fazer esses 2 asyncs juntos
+      const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
+      const storagedToken = await AsyncStorage.getItem('@RNAuth:token');
+
+      if (storagedUser && storagedToken) {
+        setUser(JSON.parse(storagedUser));
+      }
+    }
+
+    loadStoragedData();
+  }, []);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);

+    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
+    await AsyncStorage.setItem('@RNAuth:token', response.token);
  }

  async function signOut() {
-    setUser(null);
+    AsyncStorage.clear().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{signed: !!user, user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```
