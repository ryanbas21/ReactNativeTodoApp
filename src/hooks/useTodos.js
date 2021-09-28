/*
 * forgerock-sample-web-react
 *
 * fetch.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { useEffect } from 'react';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
const { ForgeRockModule } = NativeModules;

function createRequest(method, tokenType, token, data = null) {
  const request = {
    url: API_URL,
    init: {
      method,
      body: data && JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        authorization: `${tokenType} ${token}`,
      },
    },
  };
  return request;
}
/**
 * @function useTodos - A custom React hook for fetching todos from API
 * @param {Function} dispatch - The function to pass in an action with data to result in new state
 * @param {Function} setFetched - A function for setting the state of hasFetched
 * @param {string} todosLength - The todo collection
 * @returns {undefined} - this doesn't directly return anything, but calls dispatch to set data
 */
export function useTodos(dispatch, setFetched, todos) {
  /**
   * Since we are making an API call, which is a side-effect,
   * we will wrap this in a useEffect, which will re-render the
   * view once the API request returns.
   */
  useEffect(() => {
    async function getTodos() {
      // Request the todos from our resource API
      // const navigation = useNavigation();
      // console.log('navigation', navigation);
      const json = await ForgeRockModule.getAccessToken();
      const { tokenType, value: token } = JSON.parse(json);
      const requestObj = createRequest('GET', tokenType, token);
      // setFetched(false);
      try {
        const fetched = await fetch(`todos`, requestObj);
        console.log(fetched);
      } catch (err) {
        console.log('here is err', err);
      }

      if (fetchedTodos.error) {
        return navigation.navigate('Login');
      }
      setFetched(true);
      dispatch({ type: 'init-todos', payload: { todos: fetchedTodos } });
    }

    getTodos();
  }, [todos]);
}
