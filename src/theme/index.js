import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';

export default function ({ children }) {
  const theme = extendTheme({
    components: {
      Checkbox: {
        variants: {
          rounded: () => ({
            rounded: 'full',
          }),
        },
      },
    },
  });
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
}
