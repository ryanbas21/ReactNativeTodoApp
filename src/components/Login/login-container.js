import React, { useContext, useEffect, useState } from 'react';
import { Box, VStack, FormControl } from 'native-base';
import { NativeModules } from 'react-native';

import { AppContext } from '../../global-state.js';
import { Password } from '../common/password';
import { Username } from '../common/username';
import { Loading } from '../utilities/loading';
import { Footer } from './footer';
import { Header } from './header';

const { ForgeRockModule } = NativeModules;

// Given a CallbackType, return a Component
const callbackToComponentMap = {
  NameCallback: ({ label, setter }) => (
    <Username setUsername={setter} label={label} key={label} />
  ),
  PasswordCallback: ({ label, setter }) => (
    <Password setter={setter} label={label} key={label} />
  ),
};

function LoginContainer({ step, callbacks, error, setLoading, loading }) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(error);
  const [, { setAuthentication }] = useContext(AppContext);

  const setStateByType = {
    PasswordCallback: setPass,
    NameCallback: setUsername,
  };

  const getValueByType = {
    PasswordCallback: pass,
    NameCallback: username,
  };

  const handleFailure = () => {
    setErr('Invalid username or password');
  };

  const handleSubmit = async () => {
    /*
     * We need to mutate the callbacks map in order to send the updated values through the next step
     * in the journey
     */
    setLoading(true);

    const newCallbacks = callbacks.map(({ type, response }) => {
      response.input[0].value = getValueByType[type];
      return response;
    });

    const request = JSON.stringify({ ...step, callbacks: newCallbacks });

    try {
      /*
       * Call the next step in the authentication journey, passing in the data to submit.
       * We want to pass in the mutated callbacks array, which contains the values the user has
       * added to the form
       */
      const response = await ForgeRockModule.next(request);

      /*
       * If we have the LoginSuccess case, the IOS SDK has already gone through the token flow
       */
      if (response.type === 'LoginSuccess') {
        setAuthentication(true);
        setLoading(false);
      } else {
        handleFailure('Error submitting form');
        setAuthentication(false);
        setLoading(false);
      }
    } catch (error) {
      if (error && error.message) {
        handleFailure(error);
      } else {
        handleFailure('Error submitting form');
      }
      setAuthentication(false);
      setLoading(false);
    }
  };

  return loading ? (
    <Loading message={'Checking your session'} />
  ) : (
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
