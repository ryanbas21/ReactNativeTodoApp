import React, { useContext } from 'react';
import { Home, Login, Todos, Register } from '../screens';
import { AppContext } from '../global-state';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function Logout() {
  const [{}, { setAuthentication }] = useContext(AppContext);
  useEffect(() => {
    async function logout() {
      await ForgeRockModule.performUserLogout();
      setAuthentication(false);
    }
    logout();
  }, []);

  return <Loading />;
}

const LoginRoutes = () => (
  <Tab.Navigator initialRoute="Login">
    <Tab.Screen
      name="Login"
      component={Login}
      options={{
        tabBarLabel: 'Login',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="login-variant"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Register"
      component={Register}
      options={{
        tabBarLabel: 'Register',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="account-plus"
            color={color}
            size={size}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const TodoRoutes = () => (
  <Tab.Navigator initialRoute="Home">
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Todos"
      component={Todos}
      options={{
        tabBarLabel: 'Todos',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="format-list-checks"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Logout"
      component={Logout}
      options={{
        tabBarLabel: 'Logout',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="logout-variant"
            color={color}
            size={size}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

export { TodoRoutes, LoginRoutes };
