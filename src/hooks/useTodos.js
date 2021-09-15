import { useEffect } from 'react';

function useTodos() {
  useEffect(() => {
    async function getTodos() {
      const todos = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      console.log(todos);
    }
    getTodos();
  }, []);
}
export { useTodos };
