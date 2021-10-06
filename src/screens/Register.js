import React, { useEffect, useState } from 'react';
import { RegisterContainer } from '../components/Register';
import { Loading } from '../components/utilities/loading';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

function Register({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  function setResponse(response) {
    console.log('response');
    if (response.sessionToken) {
      const newData = {
        ...response,
        sessionToken: JSON.parse(response.sessionToken),
      };
      console.log('new data', newData);
      setData(newData);
      return newData;
    }
    if (response.callbacks) {
      const newData = {
        ...response,
        callbacks: response.callbacks.map((res) => ({
          ...res,
          response: JSON.parse(res.response),
        })),
      };
      setData(newData);
      return newData;
    }
  }
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
        setResponse(parsed);
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
      setData={setResponse}
      setLoading={setLoading}
      navigation={navigation}
    />
  );
}

export { Register };
