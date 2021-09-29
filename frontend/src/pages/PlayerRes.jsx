import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PlayerResShow from '../components/PlayerResShow';
import Grid from '@material-ui/core/Grid';
import BigBrain from '../bigbrain.svg';
import '../App.css';
import BlueMediumButton from '../components/BlueMediumButton';

function PlayerRes () {
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;
  const playerid = (pathname.split('/')).pop();
  const [results, setResults] = React.useState();

  React.useEffect(() => {
    fetch('http://localhost:5005/play/' + playerid + '/results', {
      method: 'GET',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
    }).then((data) => {
      if (data.status === 200) {
        data.json()
          .then(res => {
            setResults(res);
          })
      } else {
        data.json().then(res => {
          alert(res.error);
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  const goToPlay = () => {
    history.push('/play/join');
  }

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <img src={BigBrain} className="App-logo" alt="big_brain_logo" />
        <div style={{ fontSize: '70px', fontWeight: 'bold' }}>
          Your Result
        </div>
        {results
          ? <PlayerResShow results={results}/>
          : <div></div>
        }
        <BlueMediumButton fn={goToPlay} text={'Go to Home'} />
      </Grid>
    </div>
  )
}

export default PlayerRes;
