import React from 'react';
import { FormControl, Input } from 'native-base';

const TextField = ({ label, setter }) => (
  <>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input type="text" onChangeText={setter} />
  </>
);

export { TextField };
