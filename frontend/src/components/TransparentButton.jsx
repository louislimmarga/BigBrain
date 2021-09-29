import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

function TransparentButton ({ fn, text }) {
  return (
    <Button color="primary" onClick={fn}>{text}</Button>
  )
}

TransparentButton.propTypes = {
  fn: PropTypes.func,
  text: PropTypes.string
}

export default TransparentButton;
