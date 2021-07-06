import React from "react";
import { useState } from "react";

import Text from "../elements/Text";
import Button from "../elements/Button";
import Grid from "../elements/Grid";
import Input from "../elements/Input";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { auth } from "../shared/firebase";

const Login = (props) => {
    const dispatch = useDispatch();
    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');


    const login = () => {
        if (id === '' || pwd === '') {
            window.alert('이메일과 패스워드를 모두 입력해주세요');
            return;
        }
        dispatch(userActions.loginFB(id, pwd));
    }

    return (
        <div>
            <Text size="42px" bold>LOGIN</Text>
            <Input label="이메일" placeholder="이메일을 입력해주세요"
                _onChange={(e) => {
                    setId(e.target.value);
                }}
            ></Input>
            <Input label="패스워드" placeholder="패스워드를 입력해주세요"
                type="password"
                _onChange={(e) => {
                    setPwd(e.target.value);
                }}
            ></Input>
            <Button color='#fff' bg='black'
                text='로그인하기'
                _onClick={() => {
                    console.log('로그인했어');
                    login();
                }}
            >

            </Button>
        </div>
    )
}

export default Login;