import { createAction, handleActions } from "redux-actions"
import produce from "immer";

import { auth } from "../../shared/firebase";
import firebase from "firebase";

import { deleteCookie, setCookie } from "../../shared/Cookie";

// Action
// const LOG_IN = "LOG_IN";
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER"; // 리덕스에 유저 정보 넣는 액션

// ActionCreator
// 객체반환
// type 넘겨줘야함,
// const logIn = createAction(LOG_IN, (user) => ({ user }));
const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));

// initialState
const initialState = {
  user: null,
  is_login: false,
}
const user_initial = {
  nickname: 'mean0',
}

// Middleware Action
// firebase에서 로그인하는 함수
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {

    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
      auth.signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          // 로그인한 다음에 뭐를 할건지 작성하는 부분
          console.log(user); // user안에 확인해서 nickname이 어디들어가는지 찾아서 가져와준다.
          dispatch(setUser({ nickname: user.user.displayName, id: id, user_profile: '', uid: user.user.uid, }));
          history.push('/');
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    });
  }
}


// 새로고침래도 로그인 정보 안날아가게 다시 로그인 체크해서 리덕스에 정보 넣어주는 것
// firebase 인증의 '현재 로그인한 사용자' 가져오는 함수
const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({ nickname: user.displayName, id: user.email, user_profile: '', uid: user.uid, }))
      } else {
        dispatch(logOut());
      }
    })
  }
}

const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace('/');
    })
  }
}


// 가입시키기위한 유저 정보를 받아서 넘겨줘야겠지 (넘겨주는 함수호출)
const signupFB = (id, pwd, nickname) => {
  return function (dispatch, getState, { history }) {
    auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {

        auth.currentUser.updateProfile({
          displayName: nickname, // 닉네임 추가로 가져와서 업데이트 해준다.
        }).then(() => {
          // 여기까지 성공했다면 id, pwd, nickname까지 잘 가져와진 것
          // 그러면 이제 로그인상태로 바꿔주고싶어
          // setUser에 유저 정보를 담아서 보낸다. 
          dispatch(setUser({ nickname: nickname, id: id, user_profile: '', uid: user.user.uid, }));
          history.push('/');
        }).catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  }
}


// Reducer
export default handleActions(
  {
    [SET_USER]: (state, action) => produce(state, (draft) => {
      setCookie('is_login', 'success');
      draft.user = action.payload.user;
      draft.is_login = true;
    }),
    [LOG_OUT]: (state, action) => produce(state, (draft) => {
      deleteCookie('is_login');
      draft.user = null;
      draft.is_login = false;

    }),
    [GET_USER]: (state, action) =>
      produce(state, (draft) => {

      })

  }, initialState
)

// ActionCreator export
const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
}
export { actionCreators };

