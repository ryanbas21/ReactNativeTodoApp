import React from 'react';
import { FormControl, Input, Link } from 'native-base';

const Password = ({ label, setPass }) => (
  <FormControl mb={5}>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input type="password" onChangeText={setPass} />
  </FormControl>
);

export { Password };
