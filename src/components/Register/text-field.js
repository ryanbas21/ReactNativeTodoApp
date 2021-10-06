import React from 'react';
import { FormControl, Input } from 'native-base';
import { handleFailedPolicies } from '../utilities/failedPolicies';

const TextField = ({ label, setter, output }) => {
  const error = handleFailedPolicies(output);
  return (
    <FormControl isInvalid={error}>
      <FormControl.Label>{label}</FormControl.Label>
      <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
      <Input type="text" onChangeText={setter} />
    </FormControl>
  );
};

export { TextField };
