import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import BigBrain from '../bigbrain.svg';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import RedMediumButton from '../components/RedMediumButton';
import BlueMediumButton from '../components/BlueMediumButton';
import TransparentButton from '../components/TransparentButton';

function Popup ({ id, copy, next, stop }) {
  const [open, setOpen] = React.useState(true);

  const handleCopy = () => {
    copy();
  }
  const handleNext = () => {
    next();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseStop = () => {
    stop();
    setOpen(false);
  };

  return (
    <div>
      <BlueMediumButton fn={handleClickOpen} text={'Open Session'} />
      <Dialog
        open = {open}
        onClose = {handleClose}
        aria-labelledby = 'simple-dialog-title'
        aria-describedby = 'simple-dialog-description'
      >
        <DialogTitle id="simple-dialog-title">{'On-going Session!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="simple-dialog-description">
            Session id: {id}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <TransparentButton fn={handleCopy} text={'Copy ID'} />
          <TransparentButton fn={handleNext} text={'Next Question'} />
          <TransparentButton fn={handleCloseStop} text={'Stop'} />
        </DialogActions>
      </Dialog>
    </div>
  )
}

Popup.propTypes = {
  id: PropTypes.number,
  copy: PropTypes.func,
  next: PropTypes.func,
  stop: PropTypes.func
}

function PopupRes ({ id, copy, res }) {
  const [open, setOpen] = React.useState(true);

  const handleCopy = () => {
    copy();
  }
  const handleRes = () => {
    res();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <BlueMediumButton fn={handleClickOpen} text={'Open Session'} />
      <Dialog
        open = {open}
        onClose = {handleClose}
        aria-labelledby = 'simple-dialog-title'
        aria-describedby = 'simple-dialog-description'
      >
        <DialogTitle id="simple-dialog-title">{'See Result!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="simple-dialog-description">
            Session id: {id}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <TransparentButton fn={handleCopy} text={'Copy ID'} />
          <TransparentButton fn={handleRes} text={'See Result'} />
        </DialogActions>
      </Dialog>
    </div>
  )
}

PopupRes.propTypes = {
  id: PropTypes.number,
  copy: PropTypes.func,
  res: PropTypes.func,
}

function getInfo (quizvalue, setQuiz, token) {
  fetch('http://localhost:5005/admin/quiz/' + quizvalue.id, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'applicaton/json',
      'Content-Type': 'application/json'
    },
  }).then((data) => {
    if (data.status === 200) {
      data.json().then(res => {
        setQuiz(res);
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

function DashboardQuizzes ({ index, quizvalue, callback }) {
  const token = localStorage.getItem('token');
  const [quiz, setQuiz] = React.useState({});
  const [lastid, setLastid] = React.useState(-1);

  const history = useHistory();

  React.useEffect(() => {
    getInfo(quizvalue, setQuiz, token);
  }, [])

  const editButton = () => {
    history.push('/edit/' + quizvalue.id, {
      quizDict: quiz,
      quizId: quizvalue.id
    });
  }

  const deleteButton = () => {
    fetch('http://localhost:5005/admin/quiz/' + quizvalue.id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
    }).then((data) => {
      if (data.status === 200) {
        data.json()
          .then(res => {
            callback(index);
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

  const startButton = () => {
    if (!quiz.active) {
      fetch('http://localhost:5005/admin/quiz/' + quizvalue.id + '/start', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'applicaton/json',
          'Content-Type': 'application/json'
        },
      }).then((data) => {
        if (data.status === 200) {
          data.json()
            .then(res => {
              getInfo(quizvalue, setQuiz, token);
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
  }

  const stopButton = () => {
    fetch('http://localhost:5005/admin/quiz/' + quizvalue.id + '/end', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
    }).then((data) => {
      if (data.status === 200) {
        data.json()
          .then(res => {
            getInfo(quizvalue, setQuiz, token);
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

  const nextButton = () => {
    fetch('http://localhost:5005/admin/quiz/' + quizvalue.id + '/advance', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      },
    }).then((data) => {
      if (data.status === 200) {
        data.json()
          .then(res => {
            if (res.stage === quiz.questions.length) {
              resultButton();
            }
          })
      } else {
        data.json().then(res => {
          resultButton();
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const [toResult, setToResult] = React.useState(false);
  const resultButton = () => {
    setLastid(quiz.active);
    const newQuiz = quiz;
    newQuiz.active = null;
    setQuiz(newQuiz);
    setToResult(true);
  }

  const goToResult = () => {
    if (toResult) {
      setToResult(false);
      history.push('/result/' + lastid, {
        quiz: quiz
      });
    }
  }

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(quiz.active);
  }

  return (
    <div style={{ outline: '2px solid white', margin: '10px', padding: '15px' }}>
      <div>
          <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          >
            <Grid>
              <img src={BigBrain} style={{ height: '50px', margin: '10px' }}/>
            </Grid>
            <Grid>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {quizvalue.name}
              </div>
              <div>
                <Grid
                  container
                  spacing={0}
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  <Grid>
                    <BlueMediumButton fn={editButton} text={'Edit'} />
                  </Grid>
                  <Grid>
                    <RedMediumButton fn={deleteButton} text={'Delete'} />
                  </Grid>
                </Grid>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '15px', marginTop: '15px', outline: '1px solid red', padding: '5px' }}>
                {quiz.active
                  ? <div>Active!</div>
                  : <div>Not Active</div>
                }
              </div>
              <div>
                {quiz.active
                  ? <Popup
                      id={quiz.active}
                      copy={copyCodeToClipboard}
                      next={nextButton}
                      stop={stopButton}
                    />
                  : <>
                      {toResult
                        ? <PopupRes
                            id={lastid}
                            copy={copyCodeToClipboard}
                            res={goToResult}
                          />
                        : <Grid
                            container
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            justify="center"
                          >
                            <BlueMediumButton fn={startButton} text={'Start'} />
                          </Grid>
                      }
                    </>
                }
              </div>
            </Grid>
          </Grid>
      </div>
    </div>
  )
}
// the title, number of questions, a thumbnail, and a total time to complete (sum of all individual question times)
DashboardQuizzes.propTypes = {
  index: PropTypes.number,
  quizvalue: PropTypes.object,
  callback: PropTypes.func
}

export default DashboardQuizzes;
