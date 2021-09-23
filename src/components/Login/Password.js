import React from 'react';
import { FormControl, Input, Link } from 'native-base';

const Password = ({ label, setPass }) => (
  <FormControl mb={5}>
    <FormControl.Label
      _text={{ color: 'muted.700', fontSize: 'sm', fontWeight: 600 }}>
      {label}
    </FormControl.Label>
    <Input type="password" onChangeText={setPass} />
    <Link
      _text={{ fontSize: 'xs', fontWeight: '700', color: 'cyan.500' }}
      alignSelf="flex-end"
      mt={1}>
      Forgot Password?
    </Link>
  </FormControl>
);

export { Password };
