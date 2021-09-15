import React, { useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import { Text, Box, VStack, FormControl } from 'native-base';
import { Username } from './Username';
import { Password } from './Password';
import { TextField } from './TextField';
import { Specials } from './Specials';

const { ForgeRockModule } = NativeModules;

const map = {
  ValidatedCreateUsernameCallback: ({ label, setter }) => <Username label={label} setter={setter} key={label} />,
  StringAttributeInputCallback: ({ label, setter }) => <TextField label={label} setter={setter} key={label} />,
  BooleanAttributeInputCallback: () => <Specials />,
  ValidatedCreatePasswordCallback: () => <Password />,
  TermsAndConditionsCallback: () => <Specials />,
};
const setterMap = {};

function RegisterContainer({ data, navigation }) {
  const [next, setNext] = useState(null);
  useEffect(() => {
    async function callNext() {
      // const nxt = await ForgeRockModule.next();
      // console.log(nxt);
    }
    callNext();
    // setNext(nxt);
  }, [next]);
  console.log(data);
  return (
    <Box safeArea flex={1} p={2} w="90%" mx="auto">
      <Text>Register</Text>
      {data?.callbacks?.map(({ type, prompt: label }) => map[type]({ label, setter: setterMap[type] })) ?? null }
    </Box>
  );
}

export { RegisterContainer };
