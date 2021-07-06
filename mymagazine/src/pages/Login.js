import React from "react";

import Text from "../elements/Text";
import Button from "../elements/Button";
import Grid from "../elements/Grid";
import Input from "../elements/Input";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

const Login = (props) => {
    const dispatch = useDispatch();

    const login = () => {
        dispatch(userActions.loginAction('jieum'));
    }

    return (
        <div>
            <Text size="42px" bold>LOGIN</Text>
            <Input label="이메일"></Input>
            <Input label="패스워드"></Input>
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