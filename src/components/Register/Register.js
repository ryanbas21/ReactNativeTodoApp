import React, { useState } from 'react';
import { NativeModules } from 'react-native';
import { Text, Button, Box, FormControl, ScrollView } from 'native-base';
import { useToggle } from '../../hooks/useToggle';
import { Username } from './Username';
import { KBA } from './KBA';
import { Password } from './Password';
import { TextField } from './TextField';
import { Specials } from './Specials';

const { ForgeRockModule } = NativeModules;

const map = {
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
  const [securityQuestion, setSecurityQuestion] = useState({
    question: '',
    answer: '',
  });
  const [updates, setUpdates] = useToggle(false);
  const [specials, setSpecials] = useToggle(false);
  const [terms, setTerms] = useToggle(false);

  const valMap = {
    Username: username,
    Password: password,
    'First Name': first,
    'Last Name': last,
    'Email Address': email,
    'Select a security question': securityQuestion,
    'Send me special offers and services': specials,
    'Send me news and updates': updates,
    default: terms,
  };

  const setterMap = {
    Username: setUsername,
    Password: setPassword,
    'First Name': setFirst,
    'Last Name': setLast,
    'Email Address': setEmail,
    'Send me special offers and services': setSpecials,
    'Send me news and updates': setUpdates,
    'Select a security question': setSecurityQuestion,
    default: setTerms,
  };

  const handleRegistrationSubmit = async () => {
    const callbacks = data.callbacks.map(
      ({ prompt: label, response: { input, ...all } }) => {
        if (label === 'Select a security question') {
          input[0].value = valMap[label].question;
          input[1].value = valMap[label].answer;
        } else if (!label) {
          input[0].value = valMap['default'];
        } else {
          input[0].value = valMap[label];
        }
        return { ...all, input };
      },
    );
    try {
      const request = {
        authId: data.authId,
        authServiceId: data.authServiceId,
        callbacks,
        header: data.pageHeader,
        description: data.pageDescription,
      };
      const response = await ForgeRockModule.next(JSON.stringify(request));
      if (response.type === 'LoginSuccess') {
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
                ? map[type]({
                    label: 'TermsAndConditions',
                    terms: output[1].value,
                    setter: setterMap['default'],
                    val: valMap['default'],
                  })
                : questions
                ? map[type]({
                    label,
                    questions,
                    setter: setterMap[label],
                    val: valMap[label],
                  })
                : map[type]({
                    label,
                    setter: setterMap[label],
                    val: valMap[label],
                  }),
          ) ?? null}
          <Button onPress={handleRegistrationSubmit}>Register</Button>
        </FormControl>
      </ScrollView>
    </Box>
  );
}

export { RegisterContainer };
