import React from 'react';
import { handleFailedPolicies } from '../utilities/failedPolicies';
import { FormControl, Input } from 'native-base';

const Username = ({ label, setUsername, output }) => {
  const error = handleFailedPolicies(output);
  return (
    <FormControl isInvalid={error}>
      <FormControl.Label>{label}</FormControl.Label>
      <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
      <Input
        onChangeText={setUsername}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
      />
    </FormControl>
  );
};

export { Username };
