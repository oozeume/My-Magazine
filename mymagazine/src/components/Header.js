import React from "react";
import { useEffect } from "react";
import styled from "styled-components";

import Text from "../elements/Text";
import Button from "../elements/Button";
import Grid from "../elements/Grid";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

const Header = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);

    // if문으로 로그인 되면 헤더 변경해주기
    if (is_login) {
        return (
            <Grid is_flex>
                <Text size="40px"> MM </Text>
                <Grid is_flex>
                    <Button color='#fff' bg='black' text='MYPAGE' padding='12px'></Button>
                    <Button color='#fff' bg='black' text='NOTICE' padding='12px'></Button>
                    <Button color='#fff' bg='black' text='LOGOUT' padding='12px'
                        _onClick={() => { 
                            console.log('로그아웃했어');
                            dispatch(userActions.logOut({})); }}
                    ></Button>

                </Grid>
            </Grid>
        );
    }

    return (
        <div>
            <Grid is_flex>
                <Text size="40px"> MM </Text>
                <Grid is_flex>
                    <Button color='#fff' bg='black' text='SIGNUP' padding='12px'></Button>
                    <Button color='#fff' bg='black' text='LOGIN' padding='12px'></Button>
                </Grid>
            </Grid>


        </div>
    )
}

export default Header;

