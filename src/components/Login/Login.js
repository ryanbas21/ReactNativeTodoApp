import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
} from 'native-base';
import { NativeModules } from 'react-native';

const { ForgeRockModule } = NativeModules;

const Password = ({ label, setPass }) => (
  <FormControl mb={5}>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input type="password" onChangeText={setPass} />
    <Link
      _text={{ fontSize: 'xs', fontWeight: '700', color: 'cyan.500' }}
      alignSelf="flex-end"
      mt={1}>
      Forget Password?
    </Link>
  </FormControl>
);

const Username = ({ label, setUsername }) => (
  <FormControl>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input onChangeText={setUsername} />
  </FormControl>
);

const KBA = ({ label, setAnswer }) => (
  <FormControl>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input onChangeText={setAnswer} />
  </FormControl>
);

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

function Login({ data, callbacks, setNxt, navigation }) {
  const [username, setUsername] = useState('');
  const [ans, setAnswer] = useState('');
  const [pass, setPass] = useState('');
  const [kba, setKba] = useState(null);
  const [err, setErr] = useState(null);
  const [res, setRes] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const typeMap = {
    PasswordCallback: pass,
    KbaCreateCallback: ans,
    NameCallback: username,
  };
  const setterMap = {
    PasswordCallback: setPass,
    KbaCreateCallback: setAnswer,
    NameCallback: setUsername,
  };

  console.log(callbacks);
  useEffect(() => {
    switch (res) {
      case 'LoginSuccess': {
      }
      case 'LoginFailure': {
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
      console.log('response', response);
      if (response.type === 'LoginSuccess') {
        setToken(JSON.parse(response.sessionToken));
        setUser(ForgeRockModule.getUserInfo());
        navigation.navigate('Todos');
      }
    } catch (error) {
      setRes(error.message);
    }
  };
  const handleLogout = async () => {
    const logout = await ForgeRockModule.performUserLogout();
    setUser(null);
    setKba(null);
    setUsername(null);
    setPass(null);
    console.log(logout);
    navigation.navigate('Home');
  };
  const handleSubmit = async () => {
    const res = callbacks.map(({ type, response }) => {
      response.input[0].value = typeMap[type];
      return response;
    });

    const stringifiedResponse = JSON.stringify({ ...data, callbacks: res });

    try {
      const response = await ForgeRockModule.next(stringifiedResponse);
      setKba(JSON.parse(response));
    } catch (error) {
      setRes(error.message);
    }
  };
  if (user) {
    return (
      <Box>
        <Text>{JSON.stringify(user)}</Text>
        <Button onPress={handleLogout}>Logout</Button>
      </Box>
    );
  }
  return (
    <Box safeArea flex={1} p={2} w="90%" mx="auto">
      <Heading size="lg" color="primary.500">
        Welcome
      </Heading>
      <Heading color="muted.400" size="xs">
        Sign in to continue!
      </Heading>
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
          <VStack space={2}>
            <Button
              colorScheme="cyan"
              _text={{ color: 'white' }}
              onPress={kba ? handleKbaSubmit : handleSubmit}>
              Login
            </Button>
          </VStack>
          <HStack justifyContent="center">
            <Text fontSize="sm" color="muted.700" fontWeight={400}>
              I'm a new user.{' '}
            </Text>
            <Link
              _text={{ color: 'cyan.500', bold: true, fontSize: 'sm' }}
              href="#">
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </FormControl>
    </Box>
  );
}

export { Login };
