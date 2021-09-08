import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Theme from '../theme/index';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5 ';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Home } from '../screens/Home';
import { Todos } from '../screens/Todos';

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
      <Tab.Screen
        name="Todos"
        component={Todos}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="check-double" size={24} color="black" />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => (
            <Ionicons name="home-sharp" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Navigation;
