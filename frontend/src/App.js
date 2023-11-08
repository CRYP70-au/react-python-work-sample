import { useDispatch } from 'react-redux';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {Header} from './Components/Header'
import {Posts} from './Components/Posts'
import {Login} from './Components/Login'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Register } from './Components/Register';

export function App() {


  return (
    <Router>
    <div className="App">    
      <Header></Header>

      <div className='content'>
        <Switch>
          <Route exact path="/">
            <Posts/>
          </Route>
          <Route exact path="/login">
            <Login/>
          </Route>
          <Route exact path="/register">
            <Register/>
          </Route>
        </Switch>
      </div>
      
    </div>
    </Router>
  );
}

export default App;
