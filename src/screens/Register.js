import React, { useEffect, useState } from 'react';
import { RegisterContainer } from '../components/Register';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Register({ navigation }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function start() {
      await ForgeRockModule.frAuthStart();
      const response = await ForgeRockModule.registerWithoutUI();
      const parsed = JSON.parse(response)
      setData(parsed.callbacks.map(res => ({ ...res, response: JSON.parse(res.response) })));
    }
    start();
  }, []);
  console.log('data', data);
  return <RegisterContainer navigation={navigation} data={data} />;
}

export { Register };
