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
import { Username } from '../common/username';
import { Password } from '../common/password';
import { KBA } from './kba';
import { TextField } from './text-field';
import { Specials } from './specials';
import { registrationTypeFactory } from './typeFactory.js';

const { ForgeRockModule } = NativeModules;

const callbackTypeToComponent = {
  ValidatedCreateUsernameCallback: ({ label, setter, output }) => (
    <Username label={label} setUsername={setter} key={label} output={output} />
  ),
  StringAttributeInputCallback: ({ label, setter, val, output }) => (
    <TextField
      label={label}
      setter={setter}
      key={label}
      val={val}
      output={output}
    />
  ),
  BooleanAttributeInputCallback: ({ label, setter, val, output }) => (
    <Specials
      label={label}
      setter={setter}
      val={val}
      key={label}
      output={output}
    />
  ),
  ValidatedCreatePasswordCallback: ({ label, setter, val, output }) => (
    <Password
      label={label}
      setter={setter}
      val={val}
      key={label}
      output={output}
    />
  ),
  TermsAndConditionsCallback: ({ label, setter, val, terms, output }) => (
    <Specials
      label={label}
      setter={setter}
      val={val}
      terms={terms}
      key={label}
      output={output}
    />
  ),
  KbaCreateCallback: ({ label, setter, val, questions, output }) => (
    <KBA
      label={label}
      setter={setter}
      val={val}
      questions={questions}
      key={label}
      output={output}
    />
  ),
};

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
    console.log({
      username,
      password,
      first,
      last,
      email,
      specials,
      updates,
      securityQuestion,
      terms,
    });
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

    if (response.type === 'LoginSuccess') {
      setData(response);
      setAuthentication(true);
      setLoading(false);
      navigation.navigate('Home');
    } else {
      setData(response);
      setAuthentication(false);
      setLoading(false);
    }
  };
  console.log(data);
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
