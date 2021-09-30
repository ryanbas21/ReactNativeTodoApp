import React, { useContext, useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Theme from '../theme/index';
import { Login, Todos, Register } from '../screens';
import Loading from '../components/utilities/loading';
import { AppContext, useGlobalStateMgmt } from '../global-state';
import { useToggle } from '../hooks/useToggle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { ForgeRockModule } = NativeModules;
const Tab = createBottomTabNavigator();

function Navigation() {
  const [auth, setAuth] = useToggle();

  useEffect(() => {
    async function checkForToken() {
      try {
        if (!auth) {
          await ForgeRockModule.frAuthStart();
          const token = await ForgeRockModule.getAccessToken();
          setAuth(Boolean(token));
        }
      } catch (err) {}
    }
    checkForToken();
  }, [auth]);

  const stateMgmt = useGlobalStateMgmt({
    isAuthenticated: auth,
  });

  [{ isAuthenticated }, { setAuthentication }] = stateMgmt;

  return (
    <Theme>
      <AppContext.Provider value={stateMgmt}>
        <NavigationContainer
          theme={DefaultTheme}
          isAuthenticated={isAuthenticated}>
          <RootNavigator />
        </NavigationContainer>
      </AppContext.Provider>
    </Theme>
  );
}

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

function RootNavigator() {
  const [{ isAuthenticated }] = useContext(AppContext);

  return isAuthenticated ? (
    <Tab.Navigator initialRoute="Todos">
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
  ) : (
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
}

export default Navigation;
