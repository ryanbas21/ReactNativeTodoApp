import React, { useEffect, useState } from 'react';
import { LoginContainer } from '../components/Login';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Login({ navigation }) {
  const [callbacks, setCallbacks] = useState([]);
  const [nxt, setNxt] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await ForgeRockModule.loginWithoutUI();
        const next = JSON.parse(data);
        setNxt(next);
        setCallbacks(
          next.callbacks.map((res) => ({
            ...res,
            response: JSON.parse(res.response),
          })),
        );
      } catch (err) {
        await ForgeRockModule.performUserLogout();
        const data = await ForgeRockModule.loginWithoutUI();
        const next = JSON.parse(data);
        setNxt(next);
        setCallbacks(
          next.callbacks.map((res) => ({
            ...res,
            response: JSON.parse(res.response),
          })),
        );
      }
    })();
  }, []);

  return (
    <LoginContainer
      data={nxt}
      callbacks={callbacks}
      setNxt={setNxt}
      navigation={navigation}
    />
  );
}

export { Login };
