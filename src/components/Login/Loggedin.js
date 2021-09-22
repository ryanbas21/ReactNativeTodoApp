import React from 'react';
import { Box, Text, Button } from 'native-base';

function Loggedin({ user, handleLogout }) {
  return (
    <Box>
      <Text>{JSON.stringify(user)}</Text>
      <Button onPress={handleLogout}>Logout</Button>
    </Box>
  );
}

export { Loggedin };
