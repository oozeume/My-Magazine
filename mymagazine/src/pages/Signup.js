import React from "react";
import { useState } from "react";

import Text from "../elements/Text";
import Button from "../elements/Button";
import Grid from "../elements/Grid";
import Input from "../elements/Input";

import { useDispatch } from "react-redux";
import { actionCreators as userAction } from "../redux/modules/user";

const Signup = (props) => {
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [nickname, setNickname] = useState('');
  const [pwd_check, setPwdCheck] = useState('');


  const signup = () => {
    if (pwd !== pwd_check) {
      alert('패스워드를 체크해주세요');
      return; // 실행안시키고 함수 종료시켜버림
    }

    if (pwd.length !== Number(6)) {
      alert('패스워드를 6자 이상 입력해주세요');
      return; // 실행안시키고 함수 종료시켜버림
    }

    if (id === '' || pwd === '' || nickname === '') {
      return; // 실행안시키고 함수 종료시켜버림
    }

    dispatch(userAction.signupFB(id, pwd, nickname));
    // 여기 안에 넘길 값 넣어줘야하죠
    // input에서 작성한거 useState써서 만들어주기
  }

  return (
    <div>
      <Text size="42px" bold >SIGNUP</Text>
      <Input label="이메일" placeholder="이메일을 입력해주세요"
        _onChange={(e) => {
          setId(e.target.value);
        }}
      ></Input>
      <Input label="닉네임" placeholder="닉네임을 입력해주세요"
        _onChange={(e) => {
          setNickname(e.target.value);
        }}
      ></Input>
      <Input label="패스워드" placeholder="패스워드를 입력해주세요"
        _onChange={(e) => {
          setPwd(e.target.value);
        }}
      ></Input>
      <Input label="패스워드 확인" placeholder="패스워드를 확인해주세요"
        _onChange={(e) => {
          setPwdCheck(e.target.value);
        }}
      ></Input>
      <Button color='#fff' bg='black'
        text='회원가입하기'
        _onClick={signup}
      >

      </Button>
    </div>
  )
}

export default Signup;