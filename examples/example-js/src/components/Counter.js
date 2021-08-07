import React from 'react';
import { useGetter, useMutation } from 'vuex-but-for-react';

const Counter = () => {
  const handleIncrement = useMutation('COUNTER_INCREMENT');
  const handleDecrement = useMutation('COUNTER_DECREMENT');
  const counter = useGetter('counter');

  console.log('Counter re-render', counter);

  return (
    <div>
      <strong>Counter</strong>
      <br />
      <button onClick={handleDecrement}>-</button>
      &nbsp;
      {counter}
      &nbsp;
      <button onClick={handleIncrement}>+</button>
    </div>
  )
}

export default Counter;
