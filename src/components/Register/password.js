import React from 'react';
import { FormControl, Input } from 'native-base';
import { handleFailedPolicies } from '../utilities/failedPolicies';

const Password = ({ label, setter, output }) => {
  const error = handleFailedPolicies(output);
  return (
    <FormControl isInvalid={error}>
      <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
      <FormControl.Label
        _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
        {label}
      </FormControl.Label>
      <Input type="password" onChangeText={setter} />
    </FormControl>
  );
};

export { Password };
