# Sign Out

## src/contexts/auth.tsx

```diff
import React, {createContext, useState} from 'react';
import * as auth from '../services/auth';

interface IAuthProvider {
  children: React.ReactNode;
}

interface AuthContextData {
  signed: boolean;
  user: object | null;
  signIn(): Promise<void>;
+  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<IAuthProvider> = ({children}) => {
  const [user, setUser] = useState<object | null>(null);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);
  }

+  async function signOut() {
+    setUser(null);
+  }

  return (
-    <AuthContext.Provider value={{signed: !!user, user, signIn}}>
+    <AuthContext.Provider value={{signed: !!user, user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

## src/pages/Dashboard/index.tsx

```diff
-import React from 'react';
+import React, {useContext} from 'react';
-import {View} from 'react-native';
+import {View, Button, StyleSheet} from 'react-native';

+import AuthContext from '../../contexts/auth';
+
+const styles = StyleSheet.create({
+  container: {
+    flex: 1,
+    justifyContent: 'center',
+  },
+});

const Dashboard: React.FC = () => {
-  return <View />;
+  const {signOut} = useContext(AuthContext);
+
+  function handleSignOut() {
+    signOut();
+  }
+
+  return (
+    <View style={styles.container}>
+      <Button title="Logout" onPress={handleSignOut} />
+    </View>
+  );
};

export default Dashboard;
```
