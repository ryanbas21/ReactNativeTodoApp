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
// import { AntDesign, Ionicons } from 'react-native-vector-icons';
import { useTodos } from '../../hooks/useTodos';

function Todo({ id, title, isCompleted, handleStatusChange, i }) {
  useTodos();
  return (
    <Center key={id}>
      <Divider my={2} />
      <HStack width="100%" alignItems="center">
        <Checkbox
          isChecked={isCompleted}
          onChange={() => handleStatusChange(i)}
          value={title}
          accessibilityLabel="todos checkbox"
        />
        <Center>
          <Text mx={2} strikeThrough={isCompleted} fontSize="2xl">
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
          <Todo {...todo} {...props} i={i} key={i} />
        ))}
      </VStack>
    </ScrollView>
  );
}

export { Todos };
