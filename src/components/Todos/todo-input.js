import * as React from 'react';
import { Button, Input, HStack } from 'native-base';
import { request } from '../utilities/request';

function TodoInput({ dispatch }) {
  const [text, onChangeText] = React.useState('');

  const addTodo = async (e) => {
    e.preventDefault();
    const todo = { title: text };
    try {
      const data = await request('POST', '', todo);
      dispatch({
        type: 'add-todo',
        payload: data,
      });
    } catch (err) {
      console.error(err);
    }
    onChangeText('');
  };

  return (
    <HStack justifyContent="center" alignItems="center">
      <Input
        onChangeText={onChangeText}
        value={text}
        placeholder="Add a Todo"
        m={2}
      />
      <Button m={2} onPress={addTodo}>
        Add Todo
      </Button>
    </HStack>
  );
}

export { TodoInput };
