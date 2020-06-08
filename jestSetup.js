import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// Prevent jest test passing if Failed prop type error occures
const originalConsoleError = console.error;
console.error = message => {
  if (/(Failed prop type)/.test(message)) {
    throw new Error(message);
  }

  originalConsoleError(message);
};
