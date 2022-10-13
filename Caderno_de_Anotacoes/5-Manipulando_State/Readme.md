# Manipulando estados globais com ContextAPI

## src/App.tsx

```diff
import 'react-native-gesture-handler';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

-import AuthContext from './contexts/auth';
+import {AuthProvider} from './contexts/auth';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <NavigationContainer>
-      <AuthContext.Provider value={{signed: false}}>
+      <AuthProvider>
        <Routes />
-      </AuthContext.Provider>
+      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
```

## src/contexts/auth.tsx

```diff
-import {createContext} from 'react';
+import React, {createContext} from 'react';
+import * as auth from '../services/auth';

+interface IAuthProvider {
+  children: React.ReactNode;
+}
+
+interface AuthContextData {
+  signed: boolean;
+  user: object | null;
+  signIn(): Promise<void>;
+}

-const AuthContext = createContext({signed: true});
+const AuthContext = createContext<AuthContextData>({} as AuthContextData);

+export const AuthProvider: React.FC<IAuthProvider> = ({children}) => {
+  const [user, setUser] = useState<object | null>(null);

+  async function signIn() {
+    const response = await auth.signIn();
+
+    setUser(response.user);
+  }
+
+  return (
+    <AuthContext.Provider value={{signed: !!user, user: {}, signIn}}>
+      {children}
+    </AuthContext.Provider>
+  );
+};

export default AuthContext;
```

## src/pages/Signin/index.tsx

```diff
import React, {useContext} from 'react';
import {View, Button, StyleSheet} from 'react-native';
-import {signIn} from '../../services/auth';
import AuthContext from '../../contexts/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Signin: React.FC = () => {
-  const {signed} = useContext(AuthContext);
+  const {signed, signIn, user} = useContext(AuthContext);

  console.log(signed);
+  console.log(user);

-  async function handleSignIn() {
-    const response = await signIn();
-
-    console.log(response);
-  }
+  function handleSignIn() {
+    signIn();
+  }

  return (
    <View style={styles.container}>
      <Button title="Sign in" onPress={handleSignIn} />
    </View>
  );
};

export default Signin;
```

## src/services/auth.ts

```diff
+interface Response {
+  token: string;
+  user: {
+    name: string;
+    email: string;
+  };
+}

-export function signIn() {
+export function signIn(): Promise<Response> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        token: 'hbsefkenlfweinjfhwfjwergnkefweflwemrglne534veg54tgbt54',
        user: {
          name: 'Victor',
          email: 'victortrin@gmail.com',
        },
      });
    }, 2000);
  });
}
```

## src/routes/index.tsx

```diff
-import React from 'react';
+import React, {useContext} from 'react';

+import AuthContext from '../contexts/auth';

import AuthRoutes from './auth.routes';
+import AppRoutes from './app.routes';

const Routes: React.FC = () => {
+  const {signed} = useContext(AuthContext);

-  return <AuthRoutes />;
+  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
```
