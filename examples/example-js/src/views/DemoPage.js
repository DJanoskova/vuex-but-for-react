import Counter from '../components/Counter';
import DemoRefresh from '../components/DemoRefresh';

const DemoPage = () => {
  return (
    <div>
      <h4>Check the console logs for re-renders!</h4>
      <p>
        Neither Counter nor DemoRefresh component is wrapped in memo, yet they update only when their value changes.
      </p>
      <p>
        Demo refresh updates only once, even though we fire the mutation on each
        click. <code>vuex-but-for-react</code> won't update the context when the value is the same.
      </p>
      <Counter />
      <hr />
      <DemoRefresh />
    </div>
  )
}

export default DemoPage;
