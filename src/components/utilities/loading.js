/*
 * forgerock-sample-web-react
 *
 * loading.js
 *
 * Copyright (c) 2021 ForgeRock. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import React, { useContext } from 'react';
import { Spinner, VStack, Heading } from 'native-base';

import { AppContext } from '../../global-state';

/**
 * @function Loading - Used to display a loading message
 * @param {Object} props - The object representing React's props
 * @param {string} props.message - The message string object passed from the parent component
 * @returns {Object} - React component object
 */
export default function Loading({ message }) {
  const [state] = useContext(AppContext);

  return (
    <VStack space={4} alignItems="center">
      <Heading textAlign="center" mb="10">
        {message}
      </Heading>
      <Spinner size="lg" />
    </VStack>
  );
}