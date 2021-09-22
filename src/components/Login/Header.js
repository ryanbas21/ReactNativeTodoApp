import React from 'react';
import { Heading } from 'native-base';

function Header() {
  return (
    <React.Fragment>
      <Heading size="lg" color="primary.500">
        Welcome
      </Heading>
      <Heading color="muted.400" size="xs">
        Sign in to continue!
      </Heading>
    </React.Fragment>
  );
}

export { Header };
