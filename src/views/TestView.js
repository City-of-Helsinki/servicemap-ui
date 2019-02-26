import React from 'react';

class TestView extends React.Component {
  componentWillMount() {
    console.log('will mount');
  }

  render() {
    console.log('render');
    return (
      <div>
        <p>This stays the same</p>
        <button
          type="button"
          onClick={(e) => {
            console.log('clicked ', e);
          }}
        >
          Button
        </button>
      </div>
    );
  }
}

export default TestView;
