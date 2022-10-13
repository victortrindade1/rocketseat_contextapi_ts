# Sign In

## src/services/auth.ts

Aqui vou simular q após uma request de login pra API, veio a response dos dados do user com o token.

```ts
export default function signIn() {
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

## src/pages/Signin/index.tsx

```diff
import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
+import {signIn} from '../../services/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
const Signin: React.FC = () => {
+  async function handleSignIn() {
+    const response = await signIn();

+    console.log(response);
+  }

  return (
    <View style={styles.container}>
-      <Button title="Sign in" onPress={() => {}} />
+      <Button title="Sign in" onPress={handleSignIn} />
      <Button title="Sign in" onPress={handleSignIn} />
      <Button title="Sign in" onPress={handleSignIn} />
      <Button title="Sign in" onPress={handleSignIn} />
    </View>
  );
};

export default Signin;
```
