import './App.css';
import {Header} from './Components/Header'
import {Posts} from './Components/Posts'
import {Login} from './Components/Login'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Register } from './Components/Register';
import { CreatePost } from './Components/CreatePost';
import {Account} from './Components/Account'

export function App() {


  return (
    <Router>
    <div className="App">    
      <Header></Header>

      <div className='content'>
        <Switch>
          <Route exact path="/">
            <Posts isInprofile={false}/>
          </Route>
          <Route exact path="/login">
            <Login/>
          </Route>
          <Route exact path="/register">
            <Register/>
          </Route>
          <Route exact path="/create-post">
            <CreatePost/>
          </Route>
          <Route exact path="/my-posts">
            <Posts isInProfile={true}/>
          </Route>
          <Route exact path="/me">
            <Account/>
          </Route>
        </Switch>
      </div>
      
    </div>
    </Router>
  );
}

export default App;
