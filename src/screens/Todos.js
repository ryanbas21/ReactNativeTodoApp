import * as React from 'react';
import { TodoContainer } from '../components/Todos/';
import { View } from 'react-native';

function Todos() {
  return (
    <View>
      <TodoContainer addTodo={() => {}} />
    </View>
  );
}

export { Todos };
