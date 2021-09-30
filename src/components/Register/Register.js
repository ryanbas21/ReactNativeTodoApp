import React, { useContext, useState } from 'react';
import { NativeModules } from 'react-native';
import { Text, Button, Box, FormControl, ScrollView } from 'native-base';

import { useToggle } from '../../hooks/useToggle';
import { AppContext } from '../../global-state.js';
import { Username } from './Username';
import { KBA } from './KBA';
import { Password } from './Password';
import { TextField } from './TextField';
import { Specials } from './Specials';
import { registrationTypeFactory } from './typeFactory.js';

const { ForgeRockModule } = NativeModules;

const callbackTypeToComponent = {
  ValidatedCreateUsernameCallback: ({ label, setter }) => (
    <Username label={label} setUsername={setter} key={label} />
  ),
  StringAttributeInputCallback: ({ label, setter, val }) => (
    <TextField label={label} setter={setter} key={label} val={val} />
  ),
  BooleanAttributeInputCallback: ({ label, setter, val }) => (
    <Specials label={label} setter={setter} val={val} key={label} />
  ),
  ValidatedCreatePasswordCallback: ({ label, setter, val }) => (
    <Password label={label} setter={setter} val={val} key={label} />
  ),
  TermsAndConditionsCallback: ({ label, setter, val, terms }) => (
    <Specials
      label={label}
      setter={setter}
      val={val}
      terms={terms}
      key={label}
    />
  ),
  KbaCreateCallback: ({ label, setter, val, questions }) => (
    <KBA
      label={label}
      setter={setter}
      val={val}
      questions={questions}
      key={label}
    />
  ),
};

function RegisterContainer({ data, navigation }) {
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
    try {
      const request = {
        callbacks,
        authId: data.authId,
        authServiceId: data.authServiceId,
        header: data.pageHeader,
        description: data.pageDescription,
      };

      const response = await ForgeRockModule.next(JSON.stringify(request));
      if (response.type === 'LoginSuccess') {
        setAuthentication(true);
        navigation.navigate('Todos');
      } else if (response.type === 'LoginFailure') {
        // handle failure
      }
    } catch (err) {}
  };

  return (
    <Box safeArea flex={1} p={2} w="90%" mx="auto">
      <Text>Register</Text>
      <ScrollView>
        <FormControl isRequired>
          {data?.callbacks.map(
            ({
              type,
              prompt: label,
              predefinedQuestions: questions,
              response: { output },
            }) =>
              type === 'TermsAndConditionsCallback'
                ? callbackTypeToComponent[type]({
                    label: 'TermsAndConditions',
                    terms: output[1].value,
                    setter: setStateByType(),
                    val: getValueByType(),
                  })
                : questions
                ? callbackTypeToComponent[type]({
                    label,
                    questions,
                    setter: setStateByType(label),
                    val: getValueByType(label),
                  })
                : callbackTypeToComponent[type]({
                    label,
                    setter: setStateByType(label),
                    val: getValueByType(label),
                  }),
          ) ?? null}
          <Button onPress={handleRegistrationSubmit}>Register</Button>
        </FormControl>
      </ScrollView>
    </Box>
  );
}

export { RegisterContainer };
