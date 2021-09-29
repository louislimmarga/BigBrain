import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

function RedMediumButton ({ fn, text }) {
  return (
    <Button variant="contained" color="secondary" onClick={fn}>{text}</Button>
  )
}

RedMediumButton.propTypes = {
  fn: PropTypes.func,
  text: PropTypes.string
}

export default RedMediumButton;
