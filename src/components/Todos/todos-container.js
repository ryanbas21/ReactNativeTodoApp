import React, { useReducer } from 'react';
import { Box, Center, Heading, View } from 'native-base';
import { Todos } from './todo';
import { TodoInput } from './todo-input';
import { useToggle } from '../../hooks/useToggle.js';
import { useTodos } from '../../hooks/useTodos';
import { reducer } from './reducer';
import { request } from '../utilities/request';
import { Loading } from '../utilities/loading';

function TodoContainer() {
  const [fetching, setFetch] = useToggle(false);
  const [todos, dispatch] = useReducer(reducer, []);

  useTodos(dispatch, setFetch, todos);

  const editTodo = async ({ _id, title }) => {
    dispatch({ type: 'edit-todo', payload: { _id, title } });
    await request('POST', `${_id}`, { title });
  };

  const handleDelete = async (todo) => {
    await request('DELETE', todo._id, todo);
    dispatch({
      type: 'delete-todo',
      payload: { completed: !todo.completed, _id: todo._id },
    });
  };

  const handleStatusChange = async ({ _id, completed }) => {
    const todo = await request('POST', `${_id}`, { completed: !completed });
    dispatch({
      type: 'complete-todo',
      payload: todo,
    });
  };

  return fetching ? (
    <Loading message={'Loading User Data'} />
  ) : (
    <View>
      <Center>
        <Box
          shadow={1}
          _light={{
            backgroundColor: 'white',
          }}
          _dark={{
            backgroundColor: 'white',
          }}>
          <Heading
            size="2xl"
            alignSelf={{
              base: 'flex-start',
            }}>
            Your Todos
          </Heading>
          <Heading
            size="lg"
            alignSelf={{
              base: 'flex-start',
              md: 'flex-start',
            }}>
            Your Todos
          </Heading>
          <Heading
            size="sm"
            alignSelf={{
              base: 'flex-start',
              md: 'flex-start',
            }}>
            Create and manage your todos
          </Heading>
          <Center>
            <Box h={'100%'} w={'100%'} bg={'white'} p={2}>
              <TodoInput todos={todos} dispatch={dispatch} />
              <Todos
                todos={todos}
                editTodo={editTodo}
                handleDelete={handleDelete}
                handleStatusChange={handleStatusChange}
              />
            </Box>
          </Center>
        </Box>
      </Center>
    </View>
  );
}

export { TodoContainer };
