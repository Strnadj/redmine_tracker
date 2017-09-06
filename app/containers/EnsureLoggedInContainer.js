// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Route, Switch, Redirect } from 'react-router';

// Actions
import { userLogIn } from '../actions/user';

// Components
import TopBar from '../components/TopBar';
import HomePage from './HomePage';

class EnsureLoggedInContainer extends Component {
  props: {
    isLoggedIn: boolean,
    onNavigateTo: (dest: string) => any,
    loadUser: (server: string, token: string) => void,
    user: any,
    server: ?string,
    token: ?string,
    children: React$Element<*>
  }

  canUserLogIn(): boolean {
    const {
      server,
      token,
    } = this.props;

    return (server && server.length > 0 && token && token.length > 0) == true;
  }

  componentDidMount() {
    const {
      onNavigateTo,
      isLoggedIn,
      user,
      server,
      token,
      loadUser
    } = this.props;

    //if (!isLoggedIn) {
 //     console.log(`User is not logged in! Redirect...`);
      // set the current url/path for future redirection (we use a Redux action) then
      // redirect (we use a React Router method)
      // onNavigateTo('/login');
   if (!user && this.canUserLogIn()) {
      // ensure user is valid when reopen application
      loadUser(server, token);
    }
  }

  render() {
    const {
      isLoggedIn,
      server,
      token,
    } = this.props;

    if (isLoggedIn) {
      return (
        <div>
          <TopBar user={this.props.user} />
          <div>
            <Switch>
              <Route path='/' component={HomePage} />
            </Switch>
          </div>
        </div>
      );
    }

    // User is logged now
    if (!isLoggedIn && this.canUserLogIn()) {
      return null;
    }

    // Redirect to login ...
    return (
      <Redirect to="/login" />
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user');

  return {
    isLoggedIn: user.get('isLoggedIn'),
    server: user.get('server'),
    token: user.get('token'),
    user: user.get('user')
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onNavigateTo: (dest: string) => {
    dispatch(push(dest));
  },
  loadUser: (server: string, token: string): void => {
    dispatch(userLogIn(server, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedInContainer);
