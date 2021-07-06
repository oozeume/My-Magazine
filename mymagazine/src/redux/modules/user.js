import { createAction, handleActions } from "redux-actions"
import produce from "immer";

import { setCookie } from "../../shared/Cookie";

// Action
const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";

// ActionCreator
// 객체반환
// type 넘겨줘야함,
const logIn = createAction(LOG_IN, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));


// initialState
const initialState = {
  user: null,
  is_login: false,
}

// Middleware Action
// 로그인이 되면 메인페이지로 이동 
const loginAction = (user) => {
  return function (dispatch, getState, { history }) {
    dispatch(logIn(user)); // 로그인이 들어오면 실제로도 logIn액션을 해줘야하니까
    history.push('/');
  }
}

// Reducer
export default handleActions(
  {
    [LOG_IN]: (state, action) => produce(state, (draft) => {
        setCookie('is_login', 'success');
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) => 
      produce(state, (draft) => {

      }),
    [GET_USER]: (state, action) => 
      produce(state, (draft) => {

      })
    
  }, initialState
)

// ActionCreator export
const actionCreators = {
  logIn,
  logOut,
  getUser,
  loginAction,
}
export { actionCreators };

