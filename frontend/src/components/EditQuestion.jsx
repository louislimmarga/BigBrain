import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

function EditQuestion ({ index, questionvalue, callback }) {
  const [text, setText] = React.useState(questionvalue.text);
  const [type, setType] = React.useState(questionvalue.type);
  const [score, setScore] = React.useState(questionvalue.score);
  const [img, setImg] = React.useState(questionvalue.image);
  const [video, setVideo] = React.useState(questionvalue.image);
  const [timelimit, setTimelimit] = React.useState(questionvalue.timelimit);
  const [answers, setAnswers] = questionvalue.answers.length === 0
    ? React.useState([
        {
          id: 0,
          text: '',
        },
        {
          id: 1,
          text: '',
        }
      ])
    : React.useState(questionvalue.answers);
  const [correctAnswers, setCorrectAnswers] = React.useState(questionvalue.correctanswers)
  const addCorrect = (id, e) => {
    let initAnswers = [];
    if (type === 'multiple') {
      initAnswers = [...correctAnswers];
    }
    if (e.target.checked) {
      const newCorrect = [...initAnswers, id];
      setCorrectAnswers(newCorrect);
      handleCallback(index, 'correctanswers', newCorrect);
    } else {
      const i = correctAnswers.indexOf(id);
      const newCorrect = [...initAnswers];
      newCorrect.splice(i, 1);
      setCorrectAnswers(newCorrect);
      handleCallback(index, 'correctanswers', newCorrect);
    }
  }

  const checkCorrect = (id) => {
    if (correctAnswers.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  const addAnswer = () => {
    if (answers.length !== 6) {
      const newAns = {
        id: answers.length,
        text: '',
        correct: false
      };
      const newAnswers = [...answers, newAns];
      setAnswers(newAnswers);
      handleCallback(index, 'answers', newAnswers);
    } else {
      console.log('max vcalue is 6');
    }
  }

  const removeAnswer = () => {
    if (answers.length !== 2) {
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
      handleCallback(index, 'answers', newAnswers);
    } else {
      console.log('min value is 2');
    }
  }

  const handleAnswers = (idx, value) => {
    const newAnswers = [...answers];
    newAnswers[idx].text = value;
    setAnswers(newAnswers);
    handleCallback(index, 'answers', newAnswers);
  }

  const handleText = (e) => {
    setText(e.target.value);
    handleCallback(index, 'text', e.target.value);
  }

  const handleType = (e) => {
    setType(e.target.value);
    const newCorrect = [];
    setCorrectAnswers(newCorrect);
    handleCallback(index, 'correctanswers', newCorrect);
    handleCallback(index, 'type', e.target.value);
  }

  const handleTimelimit = (e) => {
    const timelimit = parseInt(e.target.value);
    setTimelimit(timelimit);
    handleCallback(index, 'timelimit', timelimit + 2);
  }

  const handleScore = (e) => {
    const score = parseInt(e.target.value);
    setScore(score);
    handleCallback(index, 'score', score);
  }

  const handleImage = (e) => {
    if (img === e.target.value) {
      return;
    }
    setImg(e.target.value);
    handleCallback(index, 'image', e.target.value);
  }

  const handleVideo = (e) => {
    if (video === e.target.value) {
      return;
    }
    setVideo(e.target.value);
    handleCallback(index, 'video', e.target.value);
  }

  const handleCallback = (index, field, data) => {
    callback(index, field, data);
  }

  return (
    <div style={{ margin: '15px', padding: '15px', outline: '1px solid black' }}>
      <div style={{ margin: '5px' }}>
        Question {questionvalue.id + 1}: <input type="text" value={text} onChange={(e) => handleText(e)}/>
      </div>
      <div style={{ margin: '5px' }}>
        Image URL: <input type="text" value={img} onChange={(e) => handleImage(e)} />
      </div>
      <div style={{ margin: '5px' }}>
        Video URL: <input type="text" value={video} onChange={(e) => handleVideo(e)} />
      </div>
      <div style={{ margin: '5px' }}>
        Question Type: <select value={type} onChange={(e) => handleType(e)}>
          <option value="multiple">Multiple Choice</option>
          <option value="single">Single Choice</option>
        </select>
      </div>
      <div style={{ margin: '5px' }}>
        Time Limit: <select value={timelimit} onChange={(e) => handleTimelimit(e)}>
          <option value='5'>5</option>
          <option value='10'>10</option>
          <option value='20'>20</option>
          <option value='30'>30</option>
          <option value='60'>60</option>
          <option value='90'>90</option>
          <option value='120'>120</option>
        </select>
      </div>
      <div style={{ margin: '5px' }}>
        Score: <input type="text" value={score} onChange={(e) => handleScore(e)}/>
      </div>
      <div>
        {answers.map((val, idx) => {
          return (
            <div key={idx} style={{ margin: '5px' }}>
              <div>
                Answer {idx + 1}: <input type="text" value={val.text} onChange={(e) => handleAnswers(idx, e.target.value)} />
              </div>
              <div>
                Correct: <input checked={checkCorrect(idx)} type="checkbox" onChange={(e) => addCorrect(idx, e)} />
              </div>
            </div>
          )
        })}
        <div style={{ width: '290px', marginTop: '15px' }}>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Grid>
              <Button variant="contained" onClick={addAnswer}>Add answer</Button>
            </Grid>
            <Grid>
              <Button variant="contained" onClick={removeAnswer}>Remove answer</Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  )
}

// the title, number of questions, a thumbnail, and a total time to complete (sum of all individual question times)
EditQuestion.propTypes = {
  index: PropTypes.number,
  questionvalue: PropTypes.object,
  callback: PropTypes.func
}

export default EditQuestion;
