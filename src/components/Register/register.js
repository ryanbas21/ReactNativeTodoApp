import React from 'react';
import { NativeModules } from 'react-native';
import { Button, Box, FormControl, ScrollView } from 'native-base';

import { Header } from './header';
import { Loading } from '../utilities/loading';
import { callbackTypeToComponent } from '../utilities/callbackMap';

const { ForgeRockModule } = NativeModules;

function RegisterContainer({ setStep, data, navigation, setLoading, loading }) {
  const handleRegistrationSubmit = async () => {
    setLoading(true);

    try {
      console.log(data);
      const response = await ForgeRockModule.next(JSON.stringify(data));
      if (response.type === 'LoginSuccess') {
        setAuthentication(true);
        setStep(response);
        navigation.navigate('Home');
      } else {
        console.log(response);
        setAuthentication(false);
        setLoading(false);
      }
    } catch (err) {
      console.log('err', err, err.message);
    }
  };

  return loading ? (
    <Loading message={'Checking your session'} />
  ) : (
    <ScrollView>
      <Box safeArea flex={1} p={2} w="90%" mx="auto">
        <Header />
        <FormControl>
          {data?.callbacks.map((callback) => {
            return callback.getType() === 'TermsAndConditionsCallback'
              ? callbackTypeToComponent[callback.getType()]({
                  callback,
                })
              : callback?.getPredefinedQuestions ?? null
              ? callbackTypeToComponent[callback.getType()]({ callback })
              : callbackTypeToComponent[callback.getType()]({ callback });
          }) ?? null}
          <Button onPress={handleRegistrationSubmit}>Register</Button>
        </FormControl>
      </Box>
    </ScrollView>
  );
}

export { RegisterContainer };
