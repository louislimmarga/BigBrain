import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import '../App.css';
import BigBrainLogo from '../bigbrain.svg';

function getStatus (id, history) {
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
        alert(res.error);
      })
    }
  }).catch((err) => {
    console.log(err);
  })
}

function Wait () {
  // timer tiap 1 detik /play/status
  // kalo true ke component gamenya
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;
  const playerid = (pathname.split('/')).pop();
  React.useEffect(() => {
    const timeoutId = window.setInterval(() => {
      getStatus(playerid, history);
    }, 1000);

    return () => window.clearInterval(timeoutId);
  }, [])
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <img src={BigBrainLogo} className="App-logo" alt="big_brain_logo" />
      <div style={{ marginBottom: '10px' }}>
        <Typography variant="h3">
          Waiting to Start....
        </Typography>
      </div>
    </Grid>
  )
}

export default Wait;
