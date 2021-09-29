import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import '../App.css';
import BigBrainLogo from '../bigbrain.svg';

function getAnswer (id, setAnswers) {
  fetch('http://localhost:5005/play/' + id + '/answer', {
    method: 'GET',
    headers: {
      Accept: 'applicaton/json',
      'Content-Type': 'application/json'
    },
  }).then((data) => {
    if (data.status === 200) {
      data.json()
        .then(res => {
          setAnswers(res.answerIds);
        })
    } else {
      data.json().then(res => {
        alert(res.error);
      })
    }
  }).catch((err) => {
    console.log(err);
  })
}

/* function getStatus (id, history) {
  fetch('http://localhost:5005/play/' + id + '/status', {
    method: 'GET',
    headers: {
      Accept: 'applicaton/json',
      'Content-Type': 'application/json'
    },
  }).then((data) => {
    if (data.status === 200) {
      data.json()
        .then(res => {
          if (res.started) {
            history.push('/play/question/' + id);
          }
        })
    } else {
      data.json().then(res => {
        console.log(res);
      })
    }
  }).catch((err) => {
    console.log(err);
  })
} */

function checkCorrect (picks, answers, setCorrect) {
  let i = 0;
  const total = picks.length;
  while (i < total) {
    if (!answers.includes(picks[i])) {
      i = 10000;
      break;
    }
    i = i + 1;
  }
  if (i === answers.length) {
    setCorrect(true);
  } else {
    setCorrect(false);
  }
}

function Answer ({ picks, question, callback }) {
  const pathname = location.pathname;
  const playerid = (pathname.split('/')).pop();
  const [correct, setCorrect] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [waiting, setWaiting] = React.useState(true);
  React.useEffect(() => {
    setTimeout(function () {
      getAnswer(playerid, setAnswers);
    }, 2000)
  }, [])

  React.useEffect(() => {
    if (answers.length !== 0) {
      checkCorrect(picks, answers, setCorrect);
      setWaiting(false);
      callback(question.score);
    }
  }, [answers])
  return (
    <div>
      {waiting
        ? <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <img src={BigBrainLogo} className="App-logo" alt="big_brain_logo" />
            <div style={{ marginBottom: '10px' }}>
              <Typography variant="h3">
                Loading...
              </Typography>
            </div>
          </Grid>
        : <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <div style={{ padding: '30px' }}>
              {correct
                ? <div style={{ fontSize: '30px' }}>Correct!</div>
                : <div style={{ fontSize: '30px' }}>Wrong!</div>
              }
            </div>
            Question score: {question.score}
          </Grid>
      }
    </div>
  )
}

Answer.propTypes = {
  picks: PropTypes.array,
  question: PropTypes.object,
  callback: PropTypes.func
}

export default Answer;
