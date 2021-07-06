import React from "react";
import styled from "styled-components";

import Text from "../elements/Text";
import Button from "../elements/Button";
import Grid from "../elements/Grid";
import Input from "../elements/Input";

const Signup = (props) => {

  return (
    <div>
      <Text size="42px" bold >SIGNUP</Text>
      <Input label="이메일"></Input>
      <Input label="닉네임"></Input>
      <Input label="패스워드"></Input>
      <Input label="패스워드 확인"></Input>
      <Button color='#fff' bg='black' text='회원가입하기'></Button>
    </div>
  )
}

export default Signup;