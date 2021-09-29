import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import '../App.css';
import BigBrainLogo from '../bigbrain.svg';
import RedMediumButton from '../components/RedMediumButton';
import BlueMediumButton from '../components/BlueMediumButton';

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  function handleme () {
    history.push({
      pathname: '/dashboard',
    });
  }

  const tryLogin = () => {
    const loginBody = {
      email: email,
      password: password
    };
    fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginBody)
    }).then((data) => {
      if (data.status === 200) {
        data.json()
          .then(res => {
            localStorage.setItem('token', res.token)
            handleme()
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

  const register = () => {
    history.push('/register');
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
      <Grid item xs={5}>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
              <div>Email</div>
              <input type='email' onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div>
              <div>Password</div>
              <input type='password' onChange={(e) => setPassword(e.target.value)}/>
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <RedMediumButton fn={tryLogin} text={'Login'} />
        </div>
        <div>
          <BlueMediumButton fn={register} text={'Register'} />
        </div>
      </Grid>
    </Grid>
  );
}

export default Login;
