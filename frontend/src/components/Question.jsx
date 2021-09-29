import React from 'react';
import PropTypes from 'prop-types';
import AnswerButton from '../components/AnswerButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function answerQuestion (playerid, ids) {
  if (ids.length === 0) {
    ids = [999999];
  }
  const body = {
    answerIds: ids
  };
  fetch('http://localhost:5005/play/' + playerid + '/answer', {
    method: 'PUT',
    headers: {
      Accept: 'applicaton/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((data) => {
    if (data.status === 200) {
      data.json()
        .then(res => {
          console.log(res);
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

function Question ({ question, callback }) {
  const pathname = location.pathname;
  const playerid = (pathname.split('/')).pop();
  const [timelimit, setTimelimit] = React.useState(question.timelimit - 2);
  const [picks, setPicks] = React.useState([]);
  const [done, setDone] = React.useState(false);
  React.useEffect(() => {
    setTimelimit(question.timelimit - 2);
    const timeout = window.setInterval(() => {
      setTimelimit(timelimit => timelimit - 1);
      if (timelimit === 0) {
        window.clearInterval(timeout);
      }
    }, 1000);

    return () => window.clearInterval(timeout);
  }, [])

  React.useEffect(() => {
    if (timelimit === 0) {
      console.log(question);
      setDone(true);
    }
  }, [timelimit])

  React.useEffect(() => {
    if (done) {
      callback(picks)
    }
  }, [done])

  const handleCallback = (id) => {
    if (!picks.includes(id)) {
      const newPicks = [...picks, id];
      setPicks(newPicks);
      answerQuestion(playerid, newPicks);
    } else {
      const i = picks.indexOf(id);
      const newPicks = [...picks];
      newPicks.splice(i, 1);
      setPicks(newPicks);
      answerQuestion(playerid, newPicks);
    }
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <div style={{ padding: '30px' }}>
        <Typography variant="h5">
          <div>{question.type} choice</div>
          Time Left: {timelimit}
        </Typography>
      </div>
      <div style={{ padding: '30px' }}>
        <Typography variant="h3">
          {question.text}
        </Typography>
      </div>
      {question.image
        ? <div>
            <img
              src={question.image}
              alt="image"
              style={{ maxWidth: '100%', height: 'auto', width: 'auto' }}
            />
          </div>
        : null
      }
      {question.video
        ? <div className="video-responsive">
            <iframe
              width="auto"
              height="auto"
              src={question.video}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
        : null
      }
      <Grid>
        {question.answers.map((val, idx) => {
          return (
            <AnswerButton key={idx}
              answer={val}
              callback={handleCallback}
            />
          )
        })}
      </Grid>
    </Grid>
  )
}

Question.propTypes = {
  question: PropTypes.object,
  callback: PropTypes.func
}

export default Question;
