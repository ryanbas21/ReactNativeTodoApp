import React from 'react';
import { FormControl, Input } from 'native-base';

const Password = ({ label, setter }) => (
  <>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input type="password" onChangeText={setter} />
  </>
);

export { Password };
