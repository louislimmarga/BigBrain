import React from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import BlueMediumButton from '../components/BlueMediumButton';
import '../App.css';
import BigBrainLogo from '../bigbrain.svg';

function joinGame (id, name, history) {
  const joinBody = {
    name: name
  }
  fetch('http://localhost:5005/play/join/' + id, {
    method: 'POST',
    headers: {
      Accept: 'applicaton/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(joinBody)
  }).then((data) => {
    if (data.status === 200) {
      data.json()
        .then(res => {
          history.push('/play/' + res.playerId);
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

function Join () {
  const [pin, setPin] = React.useState('');
  const [name, setName] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const history = useHistory();

  const handlePin = (e) => {
    setPin(e.target.value);
  }

  const handleName = (e) => {
    setName(e.target.value);
  }

  const goButton = () => {
    if (success) {
      if (isNaN(pin)) {
        console.log('Please enter a valid code!');
        return;
      }
      joinGame(pin, name, history);
    } else {
      setSuccess(true);
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
      <img src={BigBrainLogo} className="App-logo" alt="big_brain_logo" />
      <div style={{ marginBottom: '10px' }}>
        {success
          ? <>
              <div>
                Session
              </div>
              <input type="text" value={pin} onChange={(e) => handlePin(e)}/>
            </>
          : <>
              <div>
                Name
              </div>
              <input type="text" value={name} onChange={(e) => handleName(e)} />
            </>
        }
      </div>
      <BlueMediumButton fn={goButton} text={'Go!'} />
    </Grid>
  )
}

export default Join;
