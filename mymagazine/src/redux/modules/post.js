import { createAction, handleActions } from "redux-actions"
import produce from "immer";
import moment from "moment";

import { firestore, storage } from "../../shared/firebase";
import { actionCreators as imageActions } from "./image";

// Action
const SET_POST = "SET_POST"; // 파이어베이스에서 가져오면 목록을 리덕스에 넣어주는 액션
const ADD_POST = "ADD_POST"; // 리덕스 데이터 추가해주는 액션
const EDIT_POST = "EDIT_POST";

// ActionCreator
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
// 어떤거를 수정할지 알아야하니까 post_id필요로한다. 그리고 post 딕셔너리
const editPost = createAction(EDIT_POST, (post_id, post) => ({ post_id, post,}));

// initialState
// 실제 리듀서가 사용할 initialState
const initialState = {
  list: [],
}

// 게시글 하나에 어떤 정보가 있어야하는지 임의로 적어둔다. 
const initialPost = {
  // 유저 정보, 게시글 이미지, 게시글 내용, 댓글 개수, 작성날짜 
  // user_info: {
  //   id: 0,
  //   nickname: 'jieum_woo',
  //   user_profile: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  // },
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "내용이 들어갈 자리입니다.",
  comment_count: 10,
  insert_dt: "2021-02-27 10:00:00",
}

// Middleware ActionCreator
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }){
    if (!post_id) {
      console.log('게시물 정보가 없어요!');
      return;
    }

    const _image = getState().image.preview_image;

    const _post_index = getState().post.list.findIndex((p)=> p.id === post_id);
    const _post = getState().post.list[_post_index];

    console.log(_post);

    const postDB = firestore.collection('magazine');

    // preview에 있는 이미지랑 _post의 image_url이랑 같은지 확인
    if (_image === _post.image_url){
      postDB.doc(post_id).update(post).then((doc)=> {
        dispatch(editPost(post_id, {...post}));
        history.replace("/");
      });
      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage.ref(`images/${user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

      _upload.then((snapshot)=> {
        snapshot.ref.getDownloadURL().then((url)=> {
          console.log(url);
          return url;
        }).then((url)=>{
          postDB.doc(post_id).update({ ...post, image_url: url }).then((doc)=>{
            dispatch(editPost(post_id, { ...post, image_url: url }));
            history.replace('/');
          });
        }).catch((error)=>{
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", error);
        })
      })
    }

  }
}




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

const addPostFB = (contents = "") => { // PostWrite.js에서 썼던 contents 받아온다.
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection('magazine');

    // 유저정보와 작성한 포스트 정보를 합쳐서 파이어베이스 스토어에 보내야한다. 
    const _user = getState().user.user;
    const user_info = {
      nickname: _user.nickname,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    console.log(_user);

    const _post = {
      ...initialPost,
      contents: contents, // 여기서 가져온건 input에 작성한 거
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss")
    }
    console.log(_post);

    //preview에 올라간 이미지의 url가져올거다
    const _image = getState().image.preview_image;
    console.log(_image);
    console.log(typeof _image);
    //ref()안에 파일 이름을 넣어주는데(파일 이름 지정해주는 방식-작성자id와 현재시간)- 한사람당 같은 시간에 한장밖에 못올리니까
    const _upload = storage.ref(`images/${user_info.user_id}_${new Date().getTime()}`).putString(_image, "data_url");
    
    _upload.then((snapshot) => {
      snapshot.ref.getDownloadURL().then(url => {
        console.log(url); // 링크 이제 받아왔으니까 파이어스토어에 저장할 때 image_url 같이 넣어줄 수 있겠다. 

        return url; //여기서 리턴해준 url을 .then()에서 사용할 수 있다. 
      }).then((url) => {
        postDB.add({ ...user_info, ..._post, image_url: url })
        .then((doc) => {
          // add해줄거에다가 아이디도 추가해준다. 
          let post = { user_info, ..._post, id: doc.id, image_url: url };
          dispatch(addPost(post));
          history.replace("/");


          // 이미지 업로드하고나면 프리뷰 다시 기본값으로 보여야하니까. 
          dispatch(imageActions.setPreview(null)); 
          
        }).catch((error) => {
          window.alert('post 작성 실패');
          console.log('post 작성 실패', error);
        });
      }).catch((error)=> {
        window.alert('앗, 이미지 업로드에 문제가 있어요');
        console.log('앗, 이미지 업로드에 문제가 있어요', error);
      })
    })




  }
}

// Reducer
export default handleActions(
  {
    [SET_POST]: (state, action) => produce(state, (draft) => {
      draft.list = action.payload.post_list;
    }),
    [ADD_POST]: (state, action) => produce(state, (draft) => {
      draft.list.unshift(action.payload.post);
    }),
    [EDIT_POST]: (state, action) => produce(state, (draft) => {
      let index = draft.list.findIndex((p)=> p.id === action.payload.post_id);
      draft.list[index] = {...draft.list[index], ...action.payload.post};
    }),
  }, initialState
);

// AcrionCreator export
const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
}

export { actionCreators };