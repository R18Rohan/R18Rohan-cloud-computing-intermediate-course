// Module Pattern for state encapsulation

export const CounterModule = (() => {
  // Private state variables, invisible to the outside scope
  let count = 0;
  const history: number[] = [];

  return {
    increment() {
      count++;
      history.push(count);
      return count;
    },
    decrement() {
      count--;
      history.push(count);
      return count;
    },
    getCount() {
      return count;
    },
    getHistory() {
      // Return a copy to prevent external mutation of private array
      return [...history];
    },
    reset() {
      count = 0;
      history.length = 0;
    }
  };
})();
