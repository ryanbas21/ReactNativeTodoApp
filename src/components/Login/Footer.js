import React from 'react';
import { VStack, Button, HStack, Link, Text } from 'native-base';

function Footer({ handleSubmit }) {
  return (
    <>
      <VStack space={2}>
        <Button
          colorScheme="cyan"
          _text={{ color: 'white' }}
          onPress={handleSubmit}>
          Login
        </Button>
      </VStack>
      <HStack justifyContent="center">
        <Text fontSize="sm" color="muted.700" fontWeight={400}>
          I'm a new user.{' '}
        </Text>
        <Link
          _text={{ color: 'cyan.500', bold: true, fontSize: 'sm' }}
          href="#">
          Sign Up
        </Link>
      </HStack>
    </>
  );
}

export { Footer };
