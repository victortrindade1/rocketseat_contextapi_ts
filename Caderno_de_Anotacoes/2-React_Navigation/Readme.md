# Configurando React Navigation

No RN usa o React-Navigation. O do tutorial é v5.

`yarn add @react-navigation/native@^5.x`

`yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view`

`cd ios && pod install`

`yarn add @react-navigation/stack@^5.x`

## src/App.tsx

```diff
+import 'react-native-gesture-handler';

import React from 'react';
-import {View} from 'react-native';
+import {NavigationContainer} from '@react-navigation/native';

+import Routes from './routes';

const App: React.FC = () => {
  return (
+   <NavigationContainer>
-     <View />
+     <Routes />
+   </NavigationContainer>
  );
};

export default App;
```

## src/routes/auth.routes.tsx

Vou dividir por arquivos as rotas q são permitidas. Em `auth.routes.ts` estão as rotas públicas. Em `app.routes.ts` estão as rotas privadas.

```tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Signin from '../pages/Signin';

const AuthStack = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Signin" component={Signin} />
  </AuthStack.Navigator>
);

export default AuthRoutes;
```

## src/routes/app.routes.tsx

```tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';

const AppStack = createStackNavigator();

const AppRoutes: React.FC = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="Dashboard" component={Dashboard} />
  </AppStack.Navigator>
);

export default AppRoutes;
```

## src/routes/index.tsx

```tsx
import React from 'react';

import AuthRoutes from './auth.routes';
// import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  return <AuthRoutes />;
};

export default Routes;
```
