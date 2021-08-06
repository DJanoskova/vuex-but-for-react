import React from 'react';

import { useGetter, useMutation } from '../contx/storeContext';

const Counter = () => {
  const handleIncrement = useMutation('SET_COUNTER_INCREMENT');
  const counter = useGetter('counter');

  console.log('Counter render', counter)

  const handleClick = () => {
    handleIncrement()
  }

  return (
    <button onClick={handleClick}>Increment {counter}</button>
  )
}

export default Counter;
