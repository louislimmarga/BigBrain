import React from 'react';
import PropTypes from 'prop-types';
import RedMediumButton from './RedMediumButton';
import BlueMediumButton from './BlueMediumButton';

function AnswerButton ({ answer, callback }) {
  const [click, setClick] = React.useState(false);
  const handleClick = () => {
    setClick(!click);
    callback(answer.id);
  }
  return (
    <div style={{ margin: '20px' }}>
      {click
        ? <RedMediumButton fn={handleClick} text={answer.text} />
        : <BlueMediumButton fn={handleClick} text={answer.text} />
      }
    </div>
  )
}

AnswerButton.propTypes = {
  answer: PropTypes.object,
  callback: PropTypes.func
}

export default AnswerButton;
