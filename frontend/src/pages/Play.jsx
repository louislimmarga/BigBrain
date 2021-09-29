import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Question from '../components/Question';
import Answer from './Answer';

function getQuestion (id, qid, setQuestion, setQuestionid, setChangeQuestion, history, score) {
  fetch('http://localhost:5005/play/' + id + '/question', {
    method: 'GET',
    headers: {
      Accept: 'applicaton/json',
      'Content-Type': 'application/json'
    },
  }).then((data) => {
    if (data.status === 200) {
      data.json()
        .then(res => {
          if (qid !== res.question.id) {
            setQuestion(res.question);
            setQuestionid(res.question.id);
            setChangeQuestion(false);
          }
        })
    } else {
      data.json().then(res => {
        if (qid !== -1) {
          history.push('/play/result/' + id, {
            score: score
          });
        }
      })
    }
  }).catch((err) => {
    console.log(err);
  })
}

function Play () {
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;
  const playerid = (pathname.split('/')).pop();
  const [question, setQuestion] = React.useState({});
  const [questionid, setQuestionid] = React.useState(-1);
  const [changeQuestion, setChangeQuestion] = React.useState(true);
  const [picks, setPicks] = React.useState([]);
  const [started, setStarted] = React.useState(false);
  const [score, setScore] = React.useState([]);
  const handleCallbackQuestion = (picks) => {
    setStarted(true);
    setChangeQuestion(true);
    setPicks(picks);
    const newScoreList = [...score, question.score];
    setScore(newScoreList);
  }

  const handleCallbackAnswer = (newScore) => {
    console.log('aa');
  }

  React.useEffect(() => {
    const timeout = window.setInterval(() => {
      if (changeQuestion) {
        getQuestion(playerid, questionid, setQuestion, setQuestionid, setChangeQuestion, history, score);
      } else {
        window.clearInterval(timeout);
      }
    }, 1000);

    return () => window.clearInterval(timeout);
  }, [changeQuestion])

  React.useEffect(() => {
    getQuestion(playerid, questionid, setQuestion, setQuestionid, setChangeQuestion, history, score);
  }, [])
  return (
    <div>
      {changeQuestion
        ? <div>
            {started
              ? <Answer
                picks={picks}
                question={question}
                callback={handleCallbackAnswer}
                />
              : <div></div>
            }
          </div>
        : <div>
            {isNaN(question.timelimit)
              ? <div></div>
              : <Question question={question} callback={handleCallbackQuestion}/>
            }
          </div>
      }
    </div>
  )
}

export default Play;
