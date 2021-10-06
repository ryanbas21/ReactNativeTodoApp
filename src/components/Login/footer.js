import React from 'react';
import { Link as NativeLink, VStack, Button, HStack, Text } from 'native-base';
import { Link } from '@react-navigation/native';

function Footer({ handleSubmit }) {
  return (
    <>
      <VStack space={2}>
        <Button
          colorScheme="cyan"
          _text={{ color: 'white' }}
          onPress={handleSubmit}>
          Sign in
        </Button>
      </VStack>
      <HStack justifyContent="center">
        <Text fontSize="sm" color="muted.700" fontWeight={400}>
          I'm a new user.{' '}
        </Text>
        <NativeLink>
          <Link to={{ screen: 'Register' }}>Sign Up</Link>
        </NativeLink>
      </HStack>
    </>
  );
}

export { Footer };
