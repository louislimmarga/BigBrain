import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import EditQuestion from '../components/EditQuestion';
import LogoutButton from '../components/LogoutButton';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import BigBrain from '../bigbrain.svg';
import '../App.css';
import BlueMediumButton from '../components/BlueMediumButton';

function Edit () {
  const history = useHistory();
  const location = useLocation();
  const quiz = location.state.quizDict;
  const id = location.state.quizId;
  const token = localStorage.getItem('token');
  const [questions, setQuestions] = React.useState(quiz.questions);
  const addQuestion = () => {
    const newQ = {
      text: '',
      answers: [],
      correctanswers: [],
      timelimit: 30,
      image: '',
      video: '',
      type: 'multiple',
      id: questions.length,
      score: 100
    };
    const newQuestion = [...questions, newQ];
    setQuestions(newQuestion);
  };

  const handleCallback = (i, field, data) => {
    // setQuestions(questions[i][field][data]);
    questions[i][field] = data;
    console.log(questions[i]);
  }

  const submitQuestion = () => {
    console.log(questions);
    const body = {
      name: quiz.name,
      questions: questions,
      thumbnail: quiz.thumbnail
    }
    fetch('http://localhost:5005/admin/quiz/' + id, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((data) => {
      if (data.status === 200) {
        data.json()
          .then(res => {
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

  const cancel = () => {
    history.push('/dashboard');
  }

  return (
    <div>
      <div className='nav'>
        <Toolbar>
          <Grid
            justify="space-between" // Add it here :)
            container
            spacing={10}
          >
            <Grid><img src={BigBrain} className='nav-logo' alt="big_brain_logo" onClick={cancel} /></Grid>
            <Grid item>
              <div>
                <LogoutButton />
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <div style={{ margin: '15px', padding: '5px', fontSize: '24px' }}>
          {quiz.name}
        </div>
        <div>
          {questions.map((val, idx) => {
            return (
              <EditQuestion key={idx}
                index={idx}
                questionvalue={questions[idx]}
                callback={handleCallback}
              />
            )
          })}
        </div>
        <div style={{ margin: '5px' }}>
          <BlueMediumButton fn={addQuestion} text={'Add Question'} />
        </div>
        <div style={{ margin: '5px' }}>
          <BlueMediumButton fn={submitQuestion} text={'Submit Question'} />
        </div>
        <div style={{ margin: '5px' }}>
          <BlueMediumButton fn={cancel} text={'Cancel'} />
        </div>
      </Grid>
    </div>
  )
}

export default Edit;
