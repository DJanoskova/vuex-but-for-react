import { useGetter, useMutation } from 'vuex-but-for-react';

const DemoRefresh = () => {
  const handleClick = useMutation('DEMO_VALUE_SET');
  const value = useGetter('demoRefreshValue');

  const onClick = () => {
    handleClick(1);
  }

  console.log('Demo refresh re-render: ', value);

  return (
    <div>
      <strong>Demo refresh</strong>
      <br />
      Current value: {value}
      <br />
      <button onClick={onClick}>Change value to 1</button>
    </div>
  )
}

export default DemoRefresh;
