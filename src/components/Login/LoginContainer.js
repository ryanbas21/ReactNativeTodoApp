import React, { useContext, useEffect, useState } from 'react';
import { Box, VStack, FormControl } from 'native-base';
import { NativeModules } from 'react-native';

import { AppContext } from '../../global-state.js';
import { Password } from './Password';
import { Footer } from './Footer';
import { Username } from './Username';
import { Header } from './Header';

const { ForgeRockModule } = NativeModules;

// Given a CallbackType, return a Component
const callbackToComponentMap = {
  NameCallback: ({ label, setter }) => (
    <Username setUsername={setter} label={label} key={label} />
  ),
  PasswordCallback: ({ label, setter }) => (
    <Password setPass={setter} label={label} key={label} />
  ),
};

function LoginContainer({ data, callbacks, navigation }) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(null);
  const [{ isAuthenticated }, { setAuthentication }] = useContext(AppContext);

  const setStateByType = {
    PasswordCallback: setPass,
    NameCallback: setUsername,
  };

  const getValueByType = {
    PasswordCallback: pass,
    NameCallback: username,
  };
  
  useEffect(() => {
    const loginSuccess = async () => {
      /*
       * When we get a 'LoginSuccess' message we want to complete the oauth/OIDC flow by getting
       * an access token. After getting a successful access
       * token we have completed the journey
       */
      try {
        const token = await ForgeRockModule.getAccessToken();
        if (token !== undefined) setAuthentication(true);
      } catch (err) {
        setErr('Error authenticating user, no access token');
      }
    };
    if (isAuthenticated === true) {
      loginSuccess();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      // utilize the SDK to log a user out
      await ForgeRockModule.performUserLogout();
      // reset state values upon successfully logging a user out
      setUsername(null);
      setPass(null);
      setAuthentication(false); // update global state value on logout
    } catch (err) {
      setErr('Error Logging Out');
    }
  };

  const handleSubmit = async () => {
    /*
     * We need to mutate the callbacks map in order to send the updated values through the next step
     * in the journey
     */
    const newCallbacks = callbacks.map(({ type, response }) => {
      response.input[0].value = getValueByType[type];
      return response;
    });

    const request = JSON.stringify({ ...data, callbacks: newCallbacks });

    try {
      /*
       * Call the next step in the authentication journey, passing in the data to submit.
       * We want to pass in the mutated callbacks array, which contains the values the user has
       * added to the form
       */
      const response = await ForgeRockModule.next(request);
      if (response.type === 'LoginSuccess') {
        setAuthentication(true);
      }
    } catch (error) {
      setAuthentication(false);
    }
  };

  // this will be removed when protected route impl. is done
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
                callbackToComponentMap[type]
                  ? callbackToComponentMap[type]({
                      label,
                      setter: setStateByType[type],
                    })
                  : null,
              )
            : null}
          <Footer handleSubmit={handleSubmit} />
        </VStack>
      </FormControl>
    </Box>
  );
}

export { LoginContainer };
