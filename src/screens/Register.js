import React, { useEffect, useState } from 'react';
import { RegisterContainer } from '../components/Register';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Register({ navigation }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function start() {
      try {
        await ForgeRockModule.frAuthStart();
        await ForgeRockModule.performUserLogout();
        const response = await ForgeRockModule.registerWithoutUI();
        const parsed = JSON.parse(response);
        console.log(parsed);
        setData({
          ...parsed,
          callbacks: parsed.callbacks.map((res) => ({
            ...res,
            response: JSON.parse(res.response),
          })),
        });
      } catch (err) {
        console.error(err);
      }
    }
    start();
  }, []);

  return <RegisterContainer navigation={navigation} data={data} />;
}

export { Register };
