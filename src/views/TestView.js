import { Button } from '@material-ui/core';

const React = require('react');


class TestView extends React.Component {
  componentDidMount() {
    console.log('did mount');
  }

  render() {
    console.log('render');
    return (
      <div>
        <p>Hello</p>
        <Button
          color="primary"
          type="button"
          variant="outlined"
          onClick={(e) => {
            console.log('clicked ', e);
          }}
        >
          Button
        </Button>
      </div>
    );
  }
}

export default TestView;
