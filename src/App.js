import React, { Component } from 'react';
import './App.css';
import PersonalCard from './components/PersonalCard';
import RepoList from './components/RepoList';
import { Input, Button, Grid, Box } from '@material-ui/core';

class App extends Component
{
  state = {
    username: '',
    user: {},
    repos: [],
    sorting: {
      field: 'name',
      order_asc: true
    },
    pagination: {
      page: 0,
      pages_of: 0, 
      per_page: 5,
    },
    error: ''
  }

  setError = (error) => {
    this.setState({
      error
    })
  }

  clearErrors = () => {
    this.setState({
      error: ''
    })
  }

  nextPage = () => {
    let pagination = this.state.pagination;
    if (pagination.page<pagination.pages_of) {
      pagination.page++;
      this.setState({
        pagination
      })
    }
  }

  prevPage = () => {
    let pagination = this.state.pagination;
    if (pagination.page>0) {
      pagination.page--;
      this.setState({
        pagination
      })
    }
  }

  changeSorting = (field) => {
    let sorting = this.state.sorting;
    if (field === sorting.field) {
      sorting.order_asc = !sorting.order_asc;
    }else{
      sorting.field = field;
    }
    this.setState({
      sorting
    });
    this.sortingPages();
  }

  sortingPages = () => {
    let sorting = this.state.sorting;
    let repos = this.state.repos.sort((a, b) => {
      let result = 0;
      let field = sorting.field;
      if (a[field]>b[field]) {
        result = sorting.order_asc ? 1 : -1;
      }else if (a[field]<b[field]) {
        result = sorting.order_asc ? -1 : 1;
      }
      return result;
    });
    this.setState({
      repos
    })
  }

  getPages = () => {
    let start_page = this.state.pagination.page * this.state.pagination.per_page;
    let stop_page = start_page + this.state.pagination.per_page;
    return this.state.repos.slice(start_page, stop_page);
  }

  getInfo = async () => {
    this.clearErrors();
    try {
      var user = await fetch(`https://api.github.com/users/${this.state.username}`).then(result=>{
        if (result.ok) {
          return result.json();    
        }else{
          throw new Error('404 not found')
        }
      });
    }catch(error){
      // debugger;
      this.setError(error.message);
      return;
    }
    let repos = await fetch(`https://api.github.com/users/${this.state.username}/repos?per_page=${user.public_repos}`).then(result=>(result.json()));
    let pagination = this.state.pagination;
    pagination.pages_of = Math.ceil(user.public_repos/pagination.per_page)-1;
    this.setState({
      user,
      pagination,
      repos
    });
  }

  changeUsername = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <Grid>
          <Box>
            <Input onChange={this.changeUsername} />
          </Box>
          <Box>
          <Button variant="contained" color="primary" onClick={this.getInfo}>
            Search
          </Button>
          </Box>
          <div className='error'>
            {this.state.error}
          </div>
          <PersonalCard user={this.state.user} />
          <RepoList repos={this.getPages()} sorting={this.changeSorting} />
          <Button variant="contained" color="primary" onClick={this.prevPage}>
            Prev
          </Button>
          page {this.state.pagination.page} from {this.state.pagination.pages_of}
          <Button variant="contained" color="primary" onClick={this.nextPage}>
            Next
          </Button>
        </Grid>
      </div>
    );
  }
}

export default App;
