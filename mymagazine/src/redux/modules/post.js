import { createAction, handleActions } from "redux-actions"
import produce from "immer";

import { firestore } from "../../shared/firebase";

// Action
const SET_POST = "SET_POST"; // 파이어베이스에서 가져오면 목록을 리덕스에 넣어주는 액션
const ADD_POST = "ADD_POST"; // 리덕스 데이터 추가 액션

// ActionCreator
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));


// initialState
// 실제 리듀서가 사용할 initialState
const initialState = {
  list: [],
}

// 게시글 하나에 어떤 정보가 있어야하는지 임의로 적어둔다. 
const initialPost = {
  // 유저 정보, 게시글 이미지, 게시글 내용, 댓글 개수, 작성날짜 
  user_info: {
    id: 0,
    nickname: 'jieum_woo',
    user_profile: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  },
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "내용이 들어갈 자리입니다.",
  comment_count: 10,
  insert_dt: "2021-02-27 10:00:00",
}

// Middleware Action
const getPostFB = () => { // 당장은 파이어베이스 스토어에 올려져있는걸 가져올거니까 값 받아올게 없어서 () 비워줌
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection('magazine');

    postDB.get().then((docs) => {
      let post_list = [];
      docs.forEach((doc) => {
        // 딕셔너리 구조 맞춰주기 위해 set_post 변수 만들어줌
        let real_post = { // 하나의 객체로 이안에 모두 담겨있다. 
          id: doc.id, ...doc.data()
        };

        console.log(real_post);

        let post = {
          id: doc.id,
          user_info: {
            user_id: real_post.user_id,
            nickname: real_post.nickname,
            user_profile: real_post.user_profile,
          },
          image_url: real_post.image_url,
          contents: real_post.contents,
          comment_count: real_post.comment_count,
          insert_dt: real_post.insert_dt,
        }
        post_list.push(post);
      });
      console.log(post_list); // 데이터에 잘 들어갔는지 확인
      dispatch(setPost(post_list)); // 이제 setPost에 넘겨주자

    }).catch((error) => {
      console.log("Error getting document:", error);
    }
    );

  }
}

// Reducer
export default handleActions(
  {
    [SET_POST]: (state, action) => produce(state, (draft) => {
      draft.list = action.payload.post_list;
    }),
    [ADD_POST]: (state, action) => produce(state, (draft) => {

    }),
  }, initialState
);

// AcrionCreator export
const actionCreators = {
  setPost,
  addPost,
  getPostFB,
}

export { actionCreators };