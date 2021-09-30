import React, { useReducer } from 'react';
import { NativeModules } from 'react-native';
import { Box, Center, Heading, View } from 'native-base';
import { Todos } from './Todo';
import { TodoInput } from './TodoInput';
import { useToggle } from '../../hooks/useToggle.js';
import { useTodos } from '../../hooks/useTodos';
import { reducer } from './reducer';
import { request } from '../utilities/request';

const { ForgeRockModule } = NativeModules;

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

  return (
    <View>
      <Center>
        <Box
          shadow={1}
          _light={{
            backgroundColor: 'blue.50',
          }}
          _dark={{
            backgroundColor: 'blue.700',
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
            Create and Manage your todos
          </Heading>

          <Center>
            <Box p={4} bg={'#E0F7FA'} h={'100%'}>
              <Box w={'100%'} bg={'white'} h={'70%'} p={2}>
                {fetching ? (
                  'Loading'
                ) : (
                  <>
                    <TodoInput todos={todos} dispatch={dispatch} />
                    <Center>
                      <Box alignItems="flex-start">
                        <Todos
                          todos={todos}
                          editTodo={editTodo}
                          handleDelete={handleDelete}
                          handleStatusChange={handleStatusChange}
                        />
                      </Box>
                    </Center>
                  </>
                )}
              </Box>
            </Box>
          </Center>
        </Box>
      </Center>
    </View>
  );
}

export { TodoContainer };
