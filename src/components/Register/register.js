import React, { useContext, useState } from 'react';
import { NativeModules } from 'react-native';
import {
  Text,
  Button,
  Box,
  FormControl,
  ScrollView,
  Center,
  Heading,
} from 'native-base';
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Loading } from '../utilities/loading';
import { useToggle } from '../../hooks/useToggle';
import { AppContext } from '../../global-state.js';
import { registrationTypeFactory } from './typeFactory.js';
import { callbackTypeToComponent } from '../utilities/callbackMap';

const { ForgeRockModule } = NativeModules;

function RegisterContainer({ setData, data, navigation, setLoading, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [, { setAuthentication }] = useContext(AppContext);
  const [securityQuestion, setSecurityQuestion] = useState({
    question: '',
    answer: '',
  });
  const [updates, setUpdates] = useToggle(false);
  const [specials, setSpecials] = useToggle(false);
  const [terms, setTerms] = useToggle(false);

  const getValueByType = registrationTypeFactory(
    username,
    password,
    first,
    last,
    email,
    specials,
    updates,
    securityQuestion,
    terms,
  );

  const setStateByType = registrationTypeFactory(
    setUsername,
    setPassword,
    setFirst,
    setLast,
    setEmail,
    setSpecials,
    setUpdates,
    setSecurityQuestion,
    setTerms,
  );

  const handleRegistrationSubmit = async () => {
    setLoading(true);

    const callbacks = data.callbacks.map(
      ({ prompt: label, response: { input, ...all } }) => {
        if (label === 'Select a security question') {
          input[0].value = getValueByType(label).question;
          input[1].value = getValueByType(label).answer;
        } else if (!label) {
          input[0].value = getValueByType();
        } else {
          input[0].value = getValueByType(label);
        }
        return { ...all, input };
      },
    );

    const request = {
      callbacks,
      authId: data.authId,
      authServiceId: data.authServiceId,
      header: data.pageHeader,
      description: data.pageDescription,
    };

    const response = await ForgeRockModule.next(JSON.stringify(request));

    setData(response);
    if (response.type === 'LoginSuccess') {
      setAuthentication(true);
      navigation.navigate('Home');
    } else {
      setAuthentication(false);
      setLoading(false);
    }
  };

  return loading ? (
    <Loading message={'Checking your session'} />
  ) : (
    <Box safeArea flex={1} p={2} w="90%" mx="auto">
      <Center marginBottom={4}>
        <Icon name="account-plus" size={72} color={'#c0c9d5'} />
        <Heading size="lg">Sign Up</Heading>
        <Heading size="sm">
          Already have an account? Sign in
          <Link to={{ screen: 'Login' }}>
            <Text color={'#0066CC'} fontWeight={'semibold'}>
              {' '}
              Here
            </Text>
          </Link>
        </Heading>
      </Center>

      <ScrollView>
        <FormControl>
          {data?.callbacks.map(
            ({
              type,
              prompt: label,
              predefinedQuestions: questions,
              response: { output } = {},
            }) =>
              type === 'TermsAndConditionsCallback'
                ? callbackTypeToComponent[type]({
                    output,
                    label: 'TermsAndConditions',
                    terms: output[1].value,
                    setter: setStateByType(),
                    val: getValueByType(),
                  })
                : questions
                ? callbackTypeToComponent[type]({
                    output,
                    label,
                    questions,
                    setter: setStateByType(label),
                    val: getValueByType(label),
                  })
                : callbackTypeToComponent[type]({
                    output,
                    label,
                    setter: setStateByType(label),
                    val: getValueByType(label),
                  }),
          ) ?? null}
          <Button margin={2} onPress={handleRegistrationSubmit}>
            Register
          </Button>
        </FormControl>
      </ScrollView>
    </Box>
  );
}

export { RegisterContainer };
