import React from 'react';
import { FormControl, Input } from 'native-base';

const Password = ({ label, setter }) => (
  <FormControl>
    <FormControl.Label>{label}</FormControl.Label>
    <Input type="password" onChangeText={setter} />
  </FormControl>
);

export { Password };
