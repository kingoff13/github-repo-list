import React, { Component } from 'react';
import { Avatar, Grid } from '@material-ui/core';

export default class PersonalCard extends Component {
    render() {
        return <div className="personalCard">
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Avatar src={this.props.user.avatar_url} /> 
                <div>{this.props.user.name}</div>
            </Grid>
                {this.props.user.public_repos ? <div>public repos: {this.props.user.public_repos}</div> : ''}
        </div>
    }
}