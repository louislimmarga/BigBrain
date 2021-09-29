import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

function BlueMediumButton ({ fn, text }) {
  return (
    <Button variant="contained" color="primary" onClick={fn}>{text}</Button>
  )
}

BlueMediumButton.propTypes = {
  fn: PropTypes.func,
  text: PropTypes.string
}

export default BlueMediumButton;
