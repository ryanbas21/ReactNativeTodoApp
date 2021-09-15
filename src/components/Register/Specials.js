import React from 'react';
import { Checkbox, FormControl } from 'native-base';

const Specials = ({ label, checked }) => (
  <FormControl mb={5}>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Checkbox 
	isChecked={checked} 
    />
  </FormControl>
);

export { Specials };
