import React from 'react';
import PropTypes from 'prop-types';
import PlayerResQuestions from './PlayerResQuestions';
import Grid from '@material-ui/core/Grid';

function PlayerResShow ({ results }) {
  return (
    <div>
      {results.map((val, idx) => {
        return (
          <Grid key={idx}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          >
            <PlayerResQuestions
              index={idx}
              val={val}
            />
          </Grid>
        )
      })}
    </div>
  )
}

PlayerResShow.propTypes = {
  results: PropTypes.array
}

export default PlayerResShow;
