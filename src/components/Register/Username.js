import React from 'react';
import { FormControl, Input } from 'native-base';


const Username = ({ label, setUsername }) => (
  <FormControl>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input onChangeText={setUsername} />
  </FormControl>
);

export { Username };
