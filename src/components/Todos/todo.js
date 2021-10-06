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
import { EditModal } from './edit-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Todo({ todo, handleStatusChange, handleDelete, editTodo }) {
  return (
    <React.Fragment>
      <Divider my={2} />
      <HStack width="100%" alignItems="center" justifyContent="space-between">
        <Checkbox
          isChecked={todo.completed}
          onChange={() => handleStatusChange(todo)}
          value={todo.title}
          accessibilityLabel="todos checkbox">
          <Text mx={2} strikeThrough={todo.completed} fontSize="2xl">
            {todo.title}
          </Text>
        </Checkbox>
        <Menu
          closeOnSelect={true}
          alignItems="center"
          justifyContent="center"
          placement={'right'}
          trigger={(triggerProps) => (
            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <Icon name="dots-horizontal" />
            </Pressable>
          )}>
          <Menu.Item
            closeOnSelect={true}
            alignItems={'flex-start'}
            onPress={() => handleDelete(todo)}>
            <Text>Delete</Text>
          </Menu.Item>
          <Menu.Item
            closeOnSelect={true}
            alignItems={'flex-start'}
            onPress={() => editTodo(todo)}>
            <EditModal todo={todo} editTodo={editTodo} />
          </Menu.Item>
        </Menu>
      </HStack>
    </React.Fragment>
  );
}

function Todos(props) {
  return (
    <ScrollView minWidth={'100%'} minH={200} maxH={400}>
      <VStack p={1}>
        {props.todos.map((todo) => (
          <Todo
            todo={todo}
            key={todo._id}
            editTodo={props.editTodo}
            handleDelete={props.handleDelete}
            handleStatusChange={props.handleStatusChange}
          />
        ))}
      </VStack>
    </ScrollView>
  );
}

export { Todos };
