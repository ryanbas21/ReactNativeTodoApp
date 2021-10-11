import React, { useContext, useEffect } from 'react';
import { NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Theme from '../theme/index';
import { AppContext, useGlobalStateMgmt } from '../global-state';
import { useToggle } from '../hooks/useToggle';
import { LoginRoutes, TodoRoutes } from '../navigation/routes';

const { ForgeRockModule } = NativeModules;

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

  const [{ isAuthenticated }] = stateMgmt;

  return (
    <Theme>
      <AppContext.Provider value={stateMgmt}>
        <NavigationContainer isAuthenticated={isAuthenticated}>
          <RootNavigator />
        </NavigationContainer>
      </AppContext.Provider>
    </Theme>
  );
}

function RootNavigator() {
  const [{ isAuthenticated }] = useContext(AppContext);

  return isAuthenticated ? <TodoRoutes /> : <LoginRoutes />;
}

export default Navigation;
