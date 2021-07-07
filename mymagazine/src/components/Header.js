import React from "react";
import { useEffect } from "react";
import styled from "styled-components";

import Text from "../elements/Text";
import Button from "../elements/Button";
import Grid from "../elements/Grid";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { history } from "../redux/configStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const session_key = `firebase:authUser:${apiKey}:[DEFAULT]`; // 세션 키가 있는지 없는지 확인해서 로그인 유지 시키기 위해서
  const is_session = sessionStorage.getItem(session_key) ? true : false;

  // if문으로 로그인 되면 헤더 변경해주기
  if (is_login && is_session) { // is_login 과 is_session 둘 다 참이어야함
    return (
      <Grid is_flex>
        <Text size="40px"> MM </Text>
        <Grid is_flex>
          <Button color='#fff' bg='black' text='MYPAGE' padding='12px'></Button>
          <Button color='#fff' bg='black' text='NOTICE' padding='12px'></Button>
          <Button color='#fff' bg='black' text='LOGOUT' padding='12px'
            _onClick={() => {
              console.log('로그아웃했어');
              dispatch(userActions.logoutFB({}));
            }}
          ></Button>

        </Grid>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid is_flex>
        <Text size="40px"> MM </Text>
        <Grid is_flex>
          <Button color='#fff' bg='black' text='SIGNUP' padding='12px'
            _onClick={() => {
              history.push('/signup');
            }}
          ></Button>
          <Button color='#fff' bg='black' text='LOGIN' padding='12px'
            _onClick={() => {
              history.push('/login');
            }}
          ></Button>
        </Grid>
      </Grid>


    </React.Fragment>
  )
}

export default Header;

