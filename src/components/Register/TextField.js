import React from 'react';
import { FormControl, Input } from 'native-base';

const Password = ({ label, setText }) => (
  <FormControl mb={5}>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input type="password" onChangeText={setText} />
  </FormControl>
);

export { Password };
