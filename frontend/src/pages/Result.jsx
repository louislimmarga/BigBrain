import React from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import BlueMediumButton from '../components/BlueMediumButton';
import BigBrain from '../bigbrain.svg';
import '../App.css';
import Chart from 'react-apexcharts';

function splitDate (date) {
  const arr = date.split('T');
  const yearArr = arr[0].split('-');
  let timeArr = arr[1].split('.');
  timeArr = timeArr[0].split(':')
  const ret = yearArr.concat(timeArr);
  return ret;
}

function getResults (id, setRes) {
  const token = localStorage.getItem('token');
  fetch('http://localhost:5005/admin/session/' + id + '/results', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'applicaton/json',
      'Content-Type': 'application/json'
    },
  }).then((data) => {
    if (data.status === 200) {
      data.json().then(res => {
        setRes(res.results);
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

function Result () {
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;
  const sesid = (pathname.split('/')).pop();
  const [results, setRes] = React.useState([]);
  React.useEffect(() => {
    getResults(sesid, setRes);
  }, [])

  const [qlen, setqlen] = React.useState(0);
  const [totalppl, setTotalppl] = React.useState(0);
  React.useEffect(() => {
    if (results.length > 0) {
      setTotalppl(results.length);
      setqlen(results[0].answers.length);
    }
  }, [results])

  const [totalright, setTotalright] = React.useState([]);
  const [avgTime, setAvgTime] = React.useState([]);
  const [highest, setHighest] = React.useState([]);
  React.useEffect(() => {
    const totalArr = [];
    const totalTimeArr = [];
    if (qlen > 0) {
      let i = 0;
      while (i < qlen) {
        let j = 0;
        let total = 0;
        let totalTime = 0;
        while (j < totalppl) {
          if (results[j].answers[i].correct) {
            total = total + 1;
          }
          if (results[j].answers[i].questionStartedAt === null || results[j].answers[i].answeredAt === null) {
            console.log(results[j].answers[i].answeredAt);
            totalTime = totalTime + 0;
          } else {
            const startArr = splitDate(results[j].answers[i].questionStartedAt);
            const start = new Date(startArr[0], startArr[1], startArr[2], startArr[3], startArr[4], startArr[5]);
            const endArr = splitDate(results[j].answers[i].answeredAt);
            const end = new Date(endArr[0], endArr[1], endArr[2], endArr[3], endArr[4], endArr[5]);
            const timeDiff = (end - start) / 1000;
            totalTime = totalTime + timeDiff;
          }
          j = j + 1;
        }
        const resTime = totalTime / totalppl;
        totalTimeArr.push(resTime);
        totalArr.push(total);
        i = i + 1;
      }
      const newHighest = results.map((val, idx) => {
        let k = 0;
        let totalscore = 0;
        while (k < qlen) {
          if (val.answers[k].correct) {
            totalscore = totalscore + 1;
          }
          k = k + 1;
        }
        return (
          {
            name: val.name,
            score: totalscore
          }
        )
      });
      newHighest.sort(function (first, second) {
        return second.score - first.score
      })
      if (newHighest.length > 5) {
        newHighest.length = 5;
      }
      setHighest(newHighest);
      setAvgTime(totalTimeArr);
      setTotalright(totalArr);
    }
  }, [qlen])

  const [timebargraph, setTimebargraph] = React.useState({
    series: [{
      data: []
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
      }
    }
  })

  React.useEffect(() => {
    if (avgTime.length > 0) {
      const labels = [];
      let i = 0;
      while (i < avgTime.length) {
        const newQuestion = 'Question ' + (i + 1);
        labels.push(newQuestion);
        i = i + 1;
      }
      const newTimeBargraph = {
        series: [{
          data: avgTime
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            }
          },
          dataLabels: {
            enabled: true,
          },
          xaxis: {
            categories: labels,
            labels: {
              style: {
                colors: '#FFFFFF'
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#FFFFFF'
              }
            }
          },
          title: {
            text: 'Average Time per question',
            align: 'center',
            style: {
              fontSize: '20px',
              color: '#FFFFFF'
            }
          }
        }
      }
      setTimebargraph(newTimeBargraph)
    }
  }, [avgTime])

  const [bargraph, setbargraph] = React.useState({
    series: [{
      data: []
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [],
      }
    }
  })

  React.useEffect(() => {
    if (totalright.length > 0) {
      const labels = [];
      let i = 0;
      while (i < totalright.length) {
        const newQuestion = 'Question ' + (i + 1);
        labels.push(newQuestion);
        i = i + 1;
      }
      const newBargraph = {
        series: [{
          data: totalright
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            }
          },
          dataLabels: {
            enabled: true,
          },
          xaxis: {
            categories: labels,
            labels: {
              style: {
                colors: '#FFFFFF'
              }
            }
          },
          yaxis: {
            labels: {
              style: {
                colors: '#FFFFFF'
              }
            }
          },
          title: {
            text: 'Correct Answers per question',
            align: 'center',
            style: {
              fontSize: '20px',
              color: '#FFFFFF'
            }
          }
        }
      }
      setbargraph(newBargraph)
    }
  }, [totalright])

  const returnToDashboard = () => {
    history.push('/dashboard');
  }

  return (
    <div>
    <div style={{ marginBottom: '30px', backgroundColor: '#A9A9A9' }}>
      <Toolbar>
        <Grid
          justify="space-between"
          container
          spacing={10}
        >
          <Grid><img src={BigBrain} className='nav-logo' alt="big_brain_logo" onClick={returnToDashboard}/></Grid>
          <Grid item>
            <div>
              <LogoutButton />
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
    <div>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <div style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '10px' }}>Top Players</div>
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center">
          {highest.map((val, idx) => {
            return (
              <Grid key={idx}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
              >
                <div style={{ fontSize: '30px', fontWeight: 'bold' }}>{val.name}</div>
                <div>{val.score}</div>
              </Grid>
            )
          })}
        </Grid>
        <div style={{ marginTop: '30px' }}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
              <div style={{ fontSize: '40px', fontWeight: 'bold' }}>Stats!</div>
          </Grid>
          {typeof bargraph !== 'undefined'
            ? <div>
                <Chart options={bargraph.options} series={bargraph.series} type="bar" height={350} />
                <Chart options={timebargraph.options} series={timebargraph.series} type="bar" height={350} />
              </div>
            : <div></div>
          }
        </div>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <BlueMediumButton fn={returnToDashboard} text={'Return to Dashboard'} />
        </Grid>
      </div>
  </div>
  )
}

export default Result;
