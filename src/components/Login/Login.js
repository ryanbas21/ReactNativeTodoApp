import React, { useEffect, useState } from 'react';
import { Box, VStack, FormControl } from 'native-base';
import { NativeModules } from 'react-native';

import { Password } from './Password';
import { KBA } from './KBA';
import { Footer } from './Footer';
import { Username } from './Username';
import { Loggedin } from './Loggedin';
import { Header } from './Header';

const { ForgeRockModule } = NativeModules;

const map = {
  NameCallback: ({ label, setter }) => (
    <Username setUsername={setter} label={label} key={label} />
  ),
  PasswordCallback: ({ label, setter }) => (
    <Password setPass={setter} label={label} key={label} />
  ),
  KbaCreateCallback: ({ label, setter }) => (
    <KBA setAnswer={setter} label={label} key={label} />
  ),
};

function Login({ data, callbacks, navigation }) {
  const [username, setUsername] = useState('');
  const [ans, setAnswer] = useState('');
  const [pass, setPass] = useState('');
  const [kba, setKba] = useState(null);
  const [err, setErr] = useState(null);
  const [res, setRes] = useState(null);
  const [user, setUser] = useState(null);

  const typeMap = {
    PasswordCallback: pass,
    KbaCreateCallback: ans,
    NameCallback: username,
  };

  const loginSuccess = async (setUser) => {
    const user = await ForgeRockModule.getUserInfo();
    setUser(user);
    navigation.navigate('Todos');
  };

  const setterMap = {
    PasswordCallback: setPass,
    KbaCreateCallback: setAnswer,
    NameCallback: setUsername,
  };

  useEffect(() => {
    switch (res) {
      case 'LoginSuccess': {
      }
      case 'LoginFailure': {
        console.log('err', err);
        setErr('Incorrect credentials, try again');
      }
      default: {
      }
    }
  }, [res]);

  const handleKbaSubmit = async () => {
    const res = kba.callbacks.map(({ type, response }) => {
      const res = JSON.parse(response);
      res.input[1].value = typeMap[type];
      return res;
    });

    const stringifiedResponse = JSON.stringify({ ...kba, callbacks: res });

    try {
      const response = await ForgeRockModule.next(stringifiedResponse);

      if (response.type === 'LoginSuccess') {
        loginSuccess(setUser);
      }
    } catch (error) {
      setErr(error.message);
      setRes(error.message);
    }
  };

  const handleLogout = async () => {
    await ForgeRockModule.performUserLogout();
    setUser(null);
    setKba(null);
    setUsername(null);
    setPass(null);
  };

  const handleSubmit = async () => {
    const res = callbacks.map(({ type, response }) => {
      response.input[0].value = typeMap[type];
      return response;
    });
    const stringifiedResponse = JSON.stringify({ ...data, callbacks: res });

    try {
      const response = await ForgeRockModule.next(stringifiedResponse);
      if (response.type === 'LoginSuccess') {
        loginSuccess(setUser);
      } else {
        setKba(JSON.parse(response));
      }
    } catch (error) {
      setRes(error.message);
    }
  };

  if (user) {
    return <Loggedin user={user} handleLogout={handleLogout} />;
  }
  return (
    <Box safeArea flex={1} p={2} w="90%" mx="auto">
      <Header />
      <FormControl isInvalid={Boolean(err)}>
        {err ? (
          <FormControl.ErrorMessage>{err}</FormControl.ErrorMessage>
        ) : null}
        <VStack space={2} mt={5}>
          {callbacks.length
            ? callbacks.map(({ type, prompt: label }) =>
                map[type]
                  ? map[type]({
                      label,
                      setter: setterMap[type],
                    })
                  : null,
              )
            : null}
          {kba && kba.callbacks
            ? kba.callbacks.map(({ type, prompt: label }) =>
                map[type]
                  ? map[type]({
                      label,
                      setter: setterMap[type],
                    })
                  : null,
              )
            : null}
          <Footer handleSubmit={kba ? handleKbaSubmit : handleSubmit} />
        </VStack>
      </FormControl>
    </Box>
  );
}

export { Login };
