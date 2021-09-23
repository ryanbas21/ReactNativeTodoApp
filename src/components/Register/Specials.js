import React from 'react';
import { VStack, Checkbox, FormControl, Text, Divider } from 'native-base';

const Specials = ({ label, val, setter, terms = null }) => {
  return (
    <VStack>
      <Checkbox.Group accessibilityLabel="terms-checkbox">
        <Checkbox onChange={setter} isChecked={val} aria-label="terms">
          <Text>{label}</Text>
        </Checkbox>
      </Checkbox.Group>
      {terms !== null ? <Text>{terms}</Text> : null}
    </VStack>
  );
};

export { Specials };
