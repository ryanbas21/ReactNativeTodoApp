import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Theme from '../theme/index';
import { Login, Todos, Register } from '../screens';

const Tab = createBottomTabNavigator();

function Navigation() {
  return (
    <Theme>
      <NavigationContainer theme={DefaultTheme}>
        <RootNavigator />
      </NavigationContainer>
    </Theme>
  );
}

function RootNavigator() {
  return (
    <Tab.Navigator initialRouteName="Todos">
      <Tab.Screen name="Todos" component={Todos} />
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Register" component={Register} />
    </Tab.Navigator>
  );
}

export default Navigation;
