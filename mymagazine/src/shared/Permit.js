import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

const Permit = (props) => {
    const is_user = useSelector(state => state.user.user);

    const session_key = `firebase:authUser:${apiKey}:[DEFAULT]`; // 세션 키가 있는지 없는지 확인해서 로그인 유지 시키기 위해서
    const is_session = sessionStorage.getItem(session_key) ? true : false;

    if (is_session && is_user){
        return (
            <div>
                {props.children}
            </div>
        );
    }
    return null;

}

export default Permit;
