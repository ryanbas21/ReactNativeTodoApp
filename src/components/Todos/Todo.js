import * as React from 'react';
import { Pressable } from 'react-native';
import {
  HStack,
  Menu,
  Center,
  Text,
  VStack,
  Checkbox,
  Divider,
  ScrollView,
} from 'native-base';

function Todo({ todo, handleStatusChange, handleDelete }) {
  return (
    <Center key={todo._id}>
      <Divider my={2} />
      <HStack width="100%" alignItems="center">
        <Checkbox
          isChecked={todo.isCompleted}
          onChange={() => handleStatusChange(todo)}
          value={todo.title}
          accessibilityLabel="todos checkbox"
        />
        <Center>
          <Text mx={2} strikeThrough={todo.isCompleted} fontSize="2xl">
            {title}
          </Text>
        </Center>
        <Menu
          alignItems="flex-end"
          justifyContent="center"
          placement={'right'}
          trigger={(triggerProps) => (
            <Pressable
              accessibilityLabel="More options menu"
              {...triggerProps}></Pressable>
          )}>
          <Menu.Item alignItems={'flex-end'}></Menu.Item>
        </Menu>
      </HStack>
    </Center>
  );
}

function Todos(props) {
  return (
    <ScrollView minWidth={'100%'} minH={200} maxH={400}>
      <VStack p={1}>
        {props.todos.map((todo, i) => (
          <Todo
            todo={todo}
            {...props}
            key={i}
            handleDelete={props.handleDelete}
            handleStatusChange={props.handleStatusChange}
          />
        ))}
      </VStack>
    </ScrollView>
  );
}

export { Todos };
