# Criando Hook de autenticação

Vamos criar nosso próprio hook de autenticação pra facilitar.

## src/contexts/auth.tsx

```diff
-import React, {createContext, useState, useEffect} from 'react';
+import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import * as auth from '../services/auth';
import api from '../services/api';

+interface User {
+  name: string;
+  email: string;
+}

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

        api.defaults.headers.common.Authorization = `Bearer ${storagedToken}`;
      }
    }

    loadStoragedData();
  }, []);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);

    api.defaults.headers.common.Authorization = `Bearer ${response.token}`;

    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@RNAuth:token', response.token);
  }

  function signOut() {
    // É o mesmo q:
    /**
     * await AsyncStorage.clear();
     * setUser(null)
     */
    AsyncStorage.clear().then(() => setUser(null));
  }

  return (
    <AuthContext.Provider
      value={{signed: !!user, user, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

-export default AuthContext;
+export function useAuth() {
+  const context = useContext(AuthContext);
+
+  return context;
+}
```

## src/routes/index.tsx

```diff
-import React, {useContext} from 'react';
+import React from 'react';
import {View, ActivityIndicator} from 'react-native';

-import AuthContext from '../contexts/auth';
+import {useAuth} from '../contexts/auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
-  const {signed, loading} = useContext(AuthContext);
+  const {signed, loading} = useAuth();

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
```

## src/pages/Signin/index.tsx

```diff
-import React, {useContext} from 'react';
+import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

-import AuthContext from '../../contexts/auth';
+import {useAuth} from '../../contexts/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const Signin: React.FC = () => {
-  const {signed, signIn, user} = useContext(AuthContext);
+  const {signed, signIn, user} = useAuth();

  console.log(signed);
  console.log(user);

  function handleSignIn() {
    signIn();
  }

  return (
    <View style={styles.container}>
      <Button title="Sign in" onPress={handleSignIn} />
    </View>
  );
};

export default Signin;
```

## src/pages/Dashboard/index.tsx

```diff
-import React, {useContext} from 'react';
+import React from 'react';
-import {View, Button, StyleSheet} from 'react-native';
+import {View, Button, StyleSheet, Text} from 'react-native';

-import AuthContext from '../../contexts/auth';
+import {useAuth} from '../../contexts/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
+    alignItems: 'center',
  },
});

const Dashboard: React.FC = () => {
-  const {signOut} = useContext(AuthContext);
+  const {user, signOut} = useAuth();

  function handleSignOut() {
    signOut();
  }

  return (
    <View style={styles.container}>
+      <Text>{user?.name}</Text>
      <Button title="Logout" onPress={handleSignOut} />
    </View>
  );
};

export default Dashboard;
```
