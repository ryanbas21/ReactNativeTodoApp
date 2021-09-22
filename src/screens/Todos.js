import * as React from 'react';
import { TodoContainer } from '../components/Todos/';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

function Todos() {
  return (
    <View>
      <TodoContainer addTodo={() => {}} />
    </View>
  );
}

export { Todos };
