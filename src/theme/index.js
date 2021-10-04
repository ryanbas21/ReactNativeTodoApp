import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';

export default function ({ children }) {
  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          bg: '#109cf1',
        },
      },
    },
  });
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
}
