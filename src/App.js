import React ,{Component, Fragment } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import PropTypes from 'prop-types'
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import axios from 'axios';
import About from './components/layout/page/About';
import { Alert } from './components/layout/Alert';


class App extends Component {

  state = {
    loading : false,
    users : [],
    user : {},
    repos : [],
    alert : null 
  };

/*  async componentDidMount(){
      this.setState({loading : true});
      const res = await axios.get(`https://api.github.com/users?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

      this.setState({
        users : res.data,
        loading : false
      });
  }*/


  setAlert = (msg , type) => {
    this.setState({alert : {msg , type }});

    setTimeout(() => this.setState({alert : null}) , 5000);
  };

  searchUsers = async text =>{
    this.setState({loading : true});
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
    &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({
      users : res.data.items,
      loading : false
    });
  }

  getUser = async username =>{
    this.setState({loading : true});
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
    &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({
      user : res.data,
      loading : false
    });
  }

  getUserRepos = async username =>{
    this.setState({loading : true});
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
    &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({
      repos : res.data,
      loading : false
    });
  }

  static propTypes = {
    searchUsers : PropTypes.func.isRequired,
  };
  
  clearUsers = () => this.setState({users :[] , loading : false});

  render()
  {
    const {user , loading , repos} = this.state;
    return (
      <Router>
      <div className="App">
      <Navbar />
      <Alert alert = {this.state.alert}/>
      <Switch>
        <Route exact path = '/'
          render = {props => (
            <Fragment>
          <Search 
            searchUsers = {this.searchUsers}
            clearUsers = {this.clearUsers}
            showClear = {this.state.users.length > 0}
            setAlert= {this.setAlert} />
          <Users loading = {this.state.loading} users = {this.state.users}/>

            </Fragment>
          )}/>

        <Route exact path = '/about' component = {About}/>
        <Route exact path = '/user/:login' render = {props => (
          <User 
            { ...props } 
            getUser = {this.getUser} 
            getUserRepos = {this.getUserRepos}
            user = {user} 
            repos = {repos}
            loading = {loading}/>
        )}      
        />
      </Switch>
     </div>
      </Router>
    );
  }
  
}

export default App;
