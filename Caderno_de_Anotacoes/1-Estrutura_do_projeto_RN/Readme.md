# Estrutura projeto em RN

Crie um projeto React Native:

`npx react-native init <nome_projeto> --template react-native-template-typescript`

Pra simular em iOS/Android: `yarn ios` ou `yarn android` (com emulador rodando)

## src/App.tsx

```ts
import React from 'react';
import {View} from 'react-native';

const App: React.FC = () => {
  return <View />;
};

export default App;
```

## src/pages/Dashboard/index.tsx

```ts
import React from 'react';
import {View} from 'react-native';

const Dashboard: React.FC = () => {
  return <View />;
};

export default Dashboard;
```

## src/pages/Signin/index.tsx

```ts
import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
const Signin: React.FC = () => {
  return (
    <View style={styles.container}>
      <Button title="Sign in" onPress={() => {}} />
    </View>
  );
};

export default Signin;
```
