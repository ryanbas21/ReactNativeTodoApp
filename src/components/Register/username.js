import React from 'react';
import { FormControl, Input } from 'native-base';
import { handleFailedPolicies } from '../utilities/failedPolicies';

const Username = ({ label, setUsername, output }) => {
  const error = handleFailedPolicies(output);
  return (
    <FormControl isInvalid={error}>
      <FormControl.Label
        _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
        {label}
      </FormControl.Label>
      <FormControl.ErrorMessage>
        {handleFailedPolicies(output)}
      </FormControl.ErrorMessage>
      <Input onChangeText={setUsername} />
    </FormControl>
  );
};

export { Username };
