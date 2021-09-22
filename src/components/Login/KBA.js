import React from 'react';
import { FormControl, Input } from 'native-base';

const KBA = ({ label, setAnswer }) => (
  <FormControl>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input onChangeText={setAnswer} />
  </FormControl>
);

export { KBA };
