import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

function splitDate (date) {
  const arr = date.split('T');
  const yearArr = arr[0].split('-');
  let timeArr = arr[1].split('.');
  timeArr = timeArr[0].split(':')
  const ret = yearArr.concat(timeArr);
  return ret;
}

function PlayerResShow ({ index, val }) {
  let timeDiff = 0;
  if (val.questionStartedAt !== null && val.answeredAt !== null) {
    const startArr = splitDate(val.questionStartedAt);
    const start = new Date(startArr[0], startArr[1], startArr[2], startArr[3], startArr[4], startArr[5]);
    const endArr = splitDate(val.answeredAt);
    const end = new Date(endArr[0], endArr[1], endArr[2], endArr[3], endArr[4], endArr[5]);
    timeDiff = (end - start) / 1000;
  }
  return (
    <div style={{ padding: '20px' }}>
      <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
      >
        <div style={{ fontSize: '40px', fontWeight: 'bold' }}>
          Question {index + 1}
        </div>
        {val.correct
          ? <div style={{ fontSize: '30px' }}>Correct!</div>
          : <div style={{ fontSize: '30px' }}>Wrong!</div>
        }
      Time: {timeDiff}s
      </Grid>
    </div>
  )
}

PlayerResShow.propTypes = {
  index: PropTypes.number,
  val: PropTypes.object,
}

export default PlayerResShow;
