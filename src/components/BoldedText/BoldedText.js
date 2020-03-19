import React from 'react';
import PropTypes from 'prop-types';
import { uppercaseFirst } from '../../utils';

const BoldedText = ({ text, shouldBeBold }) => {
  if (!text) {
    return null;
  }
  if (!shouldBeBold) {
    return text;
  }

  const processedText = text.toLowerCase();
  const processedShouldBeBold = shouldBeBold.toLowerCase();
  const textArray = processedText.split(processedShouldBeBold);
  let i = 0;

  return (
    <span>
      {
        textArray.map((item, index) => {
          i += 1;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`${item}-${i}`}>
              {
                index === 0
                  ? uppercaseFirst(item)
                  : item
              }
              {index !== textArray.length - 1 && (
                <b>
                  {
                    index === 0 && item === ''
                      ? uppercaseFirst(processedShouldBeBold)
                      : processedShouldBeBold
                  }
                </b>
              )}
            </React.Fragment>
          );
        })
      }
    </span>
  );
};

BoldedText.propTypes = {
  text: PropTypes.string.isRequired,
  shouldBeBold: PropTypes.string,
};

BoldedText.defaultProps = {
  shouldBeBold: null,
};

export default BoldedText;
