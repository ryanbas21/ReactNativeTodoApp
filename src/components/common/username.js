import React from 'react';
import { handleFailedPolicies } from '../utilities/failedPolicies';
import { FormControl, Input } from 'native-base';

const Username = ({ label, setUsername, output }) => {
  const error = handleFailedPolicies(output);
  return (
    <FormControl isInvalid={error}>
      <FormControl.Label
        _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
        {label}
      </FormControl.Label>
      <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
      <Input onChangeText={setUsername} />
    </FormControl>
  );
};

export { Username };