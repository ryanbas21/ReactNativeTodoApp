import React, { useEffect, useState } from 'react';
import { Login } from '../components/Login';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Home({ navigation }) {
  const [callbacks, setCallbacks] = useState([]);
  const [nxt, setNxt] = useState(null);

  useEffect(() => {
    async function logout() {
      await ForgeRockModule.performUserLogout();
    }
    logout();
  }, []);

  useEffect(() => {
    (async () => {
      await ForgeRockModule.frAuthStart();
      const data = await ForgeRockModule.loginWithoutUI();
      const next = JSON.parse(data);
      setNxt(next);
      setCallbacks(
        next.callbacks.map((res) => ({
          ...res,
          response: JSON.parse(res.response),
        })),
      );
    })();
  }, []);

  return (
    <Login
      data={nxt}
      callbacks={callbacks}
      setNxt={setNxt}
      navigation={navigation}
    />
  );
}

export { Home };
