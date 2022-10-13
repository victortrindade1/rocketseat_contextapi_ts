# Loading do login

Sem esse loading, o app vai pra tela do Signin antes de ir pra tela do dashboard, só q é mt rápido, quase imperceptível. Pra tirar essa piscada de tela, vamos criar o loading.

## src/contexts/auth.tsx

```diff
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import * as auth from '../services/auth';

interface IAuthProvider {
  children: React.ReactNode;
}

interface AuthContextData {
  signed: boolean;
  user: object | null;
+  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<IAuthProvider> = ({children}) => {
  const [user, setUser] = useState<object | null>(null);
+  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      // Depois pra melhorar, use o multiGet pra fazer esses 2 asyncs juntos
      const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
      const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
+        setLoading(false);
      }
    }

    loadStoragedData();
  }, []);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);

    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@RNAuth:token', response.token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => setUser(null));
  }

  return (
-    <AuthContext.Provider value={{signed: !!user, user, signIn, signOut}}>
+    <AuthContext.Provider
+      value={{signed: !!user, user, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

## src/routes/index.tsx

```diff
import React, {useContext} from 'react';
+import {View, ActivityIndicator} from 'react-native';

import AuthContext from '../contexts/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
-  const {signed} = useContext(AuthContext);
+  const {signed, loading} = useContext(AuthContext);

+  if (loading) {
+    return (
+      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
+        <ActivityIndicator size="large" color="#999" />
+      </View>
+    );
+  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
```
