import React, { useState } from 'react';
import { Box, Center, Divider, Heading, View } from 'native-base';
import { Todos } from './Todo';
import { TodoInput } from './TodoInput';

function TodoContainer() {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Fake Task', isCompleted: false },
  ]);

  const handleDelete = (index) => {
    const temp = todos.filter((_, itemIdx) => itemIdx !== index);
    setTodos(temp);
  };

  const handleStatusChange = (index) => {
    const temp = todos.map((item, itemIdx) =>
      itemIdx !== index
        ? item
        : {
            ...item,
            isCompleted: !item.isCompleted,
          },
    );
    setTodos(temp);
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
            <Box p={4} bg={'#E0F7FA'}>
              <Box w={'100%'} bg={'white'}>
                <TodoInput todos={todos} addTodo={setTodos} />
                <Box alignItems="flex-start">
                  <Todos
                    todos={todos}
                    handleDelete={handleDelete}
                    handleStatusChange={handleStatusChange}
                  />
                </Box>
              </Box>
            </Box>
          </Center>
        </Box>
      </Center>
    </View>
  );
}

export { TodoContainer };
