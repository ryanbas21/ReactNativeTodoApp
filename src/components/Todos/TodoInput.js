import * as React from 'react';
import { Button, Input, HStack } from 'native-base';

function createTodo(title) {
  return {
    title,
    isCompleted: false,
    id: Math.floor(Math.random() * 1000), // yes this is dumb.
  };
}

function TodoInput(props) {
  const [text, onChangeText] = React.useState('');

  const handleTodos = () => {
    props.addTodo([...props.todos, createTodo(text)]);
    onChangeText('');
  };
  return (
    <HStack justifyContent="center" alignItems="center">
      <Input
        onChangeText={onChangeText}
        value={text}
        placeholder="Add a Todo"
      />
      <Button onPress={handleTodos} accessibilityLabel="What needs doing">
        Add Todo
      </Button>
    </HStack>
  );
}

export { TodoInput };
