import React, { useEffect, useState } from 'react';
import { RegisterContainer } from '../components/Register';
import { Loading } from '../components/utilities/loading';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Register({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function start() {
      try {
        await ForgeRockModule.performUserLogout();
        const response = await ForgeRockModule.registerWithoutUI();
        const parsed = JSON.parse(response);
        setData({
          ...parsed,
          callbacks: parsed.callbacks.map((res) => ({
            ...res,
            response: JSON.parse(res.response),
          })),
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    start();
  }, []);

  return loading ? (
    <Loading message={'Checking your session'} />
  ) : (
    <RegisterContainer
      navigation={navigation}
      data={data}
      setLoading={setLoading}
    />
  );
}

export { Register };
