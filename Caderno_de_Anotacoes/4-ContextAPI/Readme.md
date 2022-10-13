# ContextAPI pra autenticação

Com o ContextAPI gerenciarei de forma global algumas states, assim como faz o Redux.

## src/contexts/auth.tsx

```tsx
import {createContext} from 'react';

const AuthContext = createContext({signed: true});

export default AuthContext;
```

## src/App.tsx

```diff
import 'react-native-gesture-handler';

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

+import AuthContext from './contexts/auth';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <NavigationContainer>
+      <AuthContext.Provider value={{signed: false}}>
         <Routes />
+      </AuthContext.Provider>
    </NavigationContainer>
  );
};

export default App;
```

## src/pages/Signin/index.tsx

```diff
import React, {useContext} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {signIn} from '../../services/auth';
+import AuthContext from '../../contexts/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Signin: React.FC = () => {
+  const {signed} = useContext(AuthContext);

+  console.log(signed);

  async function handleSignIn() {
    const response = await signIn();

    console.log(response);
  }

  return (
    <View style={styles.container}>
      <Button title="Sign in" onPress={handleSignIn} />
    </View>
  );
};

export default Signin;
```
