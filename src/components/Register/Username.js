import React from 'react';
import { FormControl, Input } from 'native-base';

const Username = ({ label, setUsername }) => (
  <>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input onChangeText={setUsername} />
  </>
);

export { Username };
