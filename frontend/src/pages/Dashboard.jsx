import React from 'react';
import PropTypes from 'prop-types';
import DashboardQuizzes from '../components/DashboardQuizzes';
import { useHistory } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import BigBrain from '../bigbrain.svg';
import '../App.css';

function Dashboard () {
  const [quizzes, setQuizzes] = React.useState([]);
  const token = localStorage.getItem('token');
  const history = useHistory();
  const [halo, setHalo] = React.useState(false)
  const quizButton = () => {
    setHalo(!halo);
  }
  React.useEffect(() => {
    fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
    }).then((data) => {
      if (data.status === 200) {
        data.json().then(res => {
          const sortedQuizzes = [...res.quizzes];

          sortedQuizzes.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
          setQuizzes(sortedQuizzes);
        })
      } else {
        data.json().then(res => {
          history.push('/');
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }, [halo])

  const [quizName, setQuizName] = React.useState('')
  const addQuiz = () => {
    const newQuizbody = {
      name: quizName
    }
    fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newQuizbody)
    }).then((data) => {
      if (data.status === 200) {
        data.json()
          .then(res => {
            console.log(res)
          })
      } else {
        data.json().then(res => {
          alert(res.error);
        })
      }
    }).catch((err) => {
      console.log(err);
    })

    quizButton();
  }

  const handleCallback = (i) => {
    const newQuizzes = [...quizzes];
    newQuizzes.splice(i, 1);
    console.log(newQuizzes);
    setQuizzes(newQuizzes);
  }

  return (
    <div>
      <div className='nav'>
        <Toolbar>
          <Grid
            justify="space-between"
            container
            spacing={10}
          >
            <Grid><img src={BigBrain} className="nav-logo" alt="big_brain_logo"/></Grid>
            <Grid item>
              <div>
                <LogoutButton />
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </div>
      <div>
        <Container maxWidth="sm">
          {quizzes.map((val, idx) => {
            return (
              <DashboardQuizzes index={idx}
                key={idx}
                quizvalue={val}
                callback={handleCallback}
              />
            )
          })}
          {halo
            ? <div>
              <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                Name: <input type="text" onChange={(e) => setQuizName(e.target.value)} />
              </div>
              <div style={{ width: '150px', marginLeft: '10px' }}>
                <Grid container spacing={2} justify='space-between'>
                  <Button spacing="5px" variant="contained" color="primary" size="small" onClick={addQuiz}>Add Quiz</Button>
                  <Button variant="contained" color="secondary" size="small" onClick={quizButton}>Cancel</Button>
                </Grid>
              </div>
            </div>
            : <Button variant="contained" color="primary" size="small" onClick={quizButton}>Create Quiz</Button>
          }
        </Container>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  token: PropTypes.string
}

export default Dashboard
