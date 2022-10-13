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
+  user: object;
+  signIn(): Promise<void>;
+}

-const AuthContext = createContext({signed: true});
+const AuthContext = createContext<AuthContextData>({} as AuthContextData);

+export const AuthProvider: React.FC<IAuthProvider> = ({
+  children,
+}: IAuthProvider) => {
+  async function signIn() {
+    const response = await auth.signIn();
+
+    console.log(response);
+  }
+
+  return (
+    <AuthContext.Provider value={{signed: false, user: {}, signIn}}>
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
+  const {signed, signIn} = useContext(AuthContext);

  console.log(signed);

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
