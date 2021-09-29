import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
// import LogoutButton from './components/LogoutButton';
import Dashboard from './pages/Dashboard';
import Edit from './pages/Edit';
import Join from './pages/Join';
import Wait from './pages/Wait';
import Play from './pages/Play';
import PlayerRes from './pages/PlayerRes';
import Result from './pages/Result';

function App () {
  return (
  <Router>
    <div className="break"></div>
    <div className="App-header">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard/>
        </Route>
        <Route exact path="/edit/:quizId">
          <Edit/>
        </Route>
        <Route exact path="/play/join">
          <Join/>
        </Route>
        <Route exact path="/result/:sessionid">
          <Result/>
        </Route>
        <Route exact path="/play/question/:playerid">
          <Play/>
        </Route>
        <Route exact path="/play/:playerid">
          <Wait/>
        </Route>
        <Route exact path="/play/result/:playerid">
          <PlayerRes/>
        </Route>
        <Route path="/">
          {localStorage.getItem('token')
            ? <Dashboard />
            : <Login />
          }
        </Route>
      </Switch>
    </div>
  </Router>
  );
}

export default App;
