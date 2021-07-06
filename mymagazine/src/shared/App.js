import React from 'react';
import { useEffect } from 'react';

import { Route } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from '../redux/configStore';

import Header from '../components/Header';
import PostList from '../pages/PostList';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

import { useDispatch } from "react-redux";
import {actionCreators as userActions} from "../redux/modules/user";
import {apiKey} from "./firebase";

function App() {
  const dispatch = useDispatch();

  const session_key = `firebase:authUser:${apiKey}:[DEFAULT]`; // 세션 키가 있는지 없는지 확인해서 로그인 유지 시키기 위해서
  const is_session = sessionStorage.getItem(session_key) ? true : false;

  console.log(is_session);
  useEffect(() => {
    // 로그인이 되었는지 안되었는지 체크해서 loginCheckFB함수를 실행시키자. 
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  }, []);

  return (
    <div>
      <Header></Header>
      <ConnectedRouter history={history}>
        <Route path="/" exact component={PostList} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
      </ConnectedRouter>
    </div>
  );
}

export default App;
