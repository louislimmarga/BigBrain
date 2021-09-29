import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import '../App.css';
import BigBrainLogo from '../bigbrain.svg';
import RedMediumButton from '../components/RedMediumButton';
import BlueMediumButton from '../components/BlueMediumButton';

function Register () {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const tryRegister = () => {
    const registerBody = {
      email: email,
      password: password,
      name: name
    };
    fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerBody)
    }).then((data) => {
      if (data.status === 200) {
        data.json().then(res => {
          localStorage.setItem('token', res.token)
          history.push('/dashboard');
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

  const login = () => {
    history.push('/login')
  }

  return (
    <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <img src={BigBrainLogo} className='App-logo' style={{ height: '200px', marginBottom: '100px', marginTop: '100px' }}/>
        <Grid item xs={5}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
                <div>Email</div>
               <input type='email' onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <div>Password</div>
                <input type='password' onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <div>Name</div>
                <input type='text' onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
          <div style={{ justifyContent: 'center' }} >
            <div style={{ marginBottom: '10px' }}>
              <RedMediumButton fn={tryRegister} text={'Register'} />
            </div>
            <div>
              <BlueMediumButton fn={login} text={'Back'} />
            </div>
          </div>
        </Grid>
      </Grid>
  );
}

export default Register;
