import { createAction, handleActions } from "redux-actions"
import produce from "immer";
import moment from "moment";

import { firestore, storage } from "../../shared/firebase";
import { actionCreators as imageActions } from "./image";

// Action
const SET_POST = "SET_POST"; // 파이어베이스에서 가져오면 목록을 리덕스에 넣어주는 액션
const ADD_POST = "ADD_POST"; // 리덕스 데이터 추가해주는 액션
const EDIT_POST = "EDIT_POST";
const LIKE_TOGGLE = "LIKE_TOGGLE"; // 좋아요 토글 액션

// ActionCreator
const setPost = createAction(SET_POST, (post_list) => ({ post_list }));
const addPost = createAction(ADD_POST, (post) => ({ post }));
// 어떤거를 수정할지 알아야하니까 post_id필요로한다. 그리고 post 딕셔너리
const editPost = createAction(EDIT_POST, (post_id, post) => ({ post_id, post, }));
const likeToggle = createAction(LIKE_TOGGLE, (post_id, is_like = null) => ({ post_id, is_like }));

// initialState
// 실제 리듀서가 사용할 initialState
const initialState = {
  list: [],
}

// 게시글 하나에 어떤 정보가 있어야하는지 임의로 적어둔다. 
const initialPost = {
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "내용이 들어갈 자리입니다.",
  comment_count: 10,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  is_like: false,
  like_cnt: 0,
}

// Middleware ActionCreator

// 게시글 하나만 가져오는 함수
// 상세 페이지에 바로 접근 할 때를 대비
const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {

    const postDB = firestore.collection('magazine');
    postDB.doc(id).get().then((doc) => {

      let _post = doc.data();
      let post = Object.keys(_post).reduce(
        (acc, cur) => {
          if (cur.indexOf("user_") !== -1) {
            return {
              ...acc,
              user_info: { ...acc.user_info, [cur]: _post[cur] },
            };
          }
          return { ...acc, [cur]: _post[cur] };
        },
        { id: doc.id, user_info: {} }
      );

      // 하나를 가져오지만, 게시글 목록은 배열이잖아요! 배열 형태에 맞게 []로 싸줍니다.
      dispatch(setIsLike([post]));
    });
  }
}

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log('게시물 정보가 없어요!');
      return;
    }

    const _image = getState().image.preview_image;

    const _post_index = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_index];

    console.log(_post);

    const postDB = firestore.collection('magazine');

    // preview에 있는 이미지랑 _post의 image_url이랑 같은지 확인
    if (_image === _post.image_url) {
      postDB.doc(post_id).update(post).then((doc) => {
        dispatch(editPost(post_id, { ...post }));
        history.replace("/");
      });
      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage.ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
          return url;
        }).then((url) => {
          postDB.doc(post_id).update({ ...post, image_url: url }).then((doc) => {
            dispatch(editPost(post_id, { ...post, image_url: url }));
            history.replace('/');
          });
        }).catch((error) => {
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
          like_cnt: real_post.like_cnt,
        }

        post_list.push(post);
      });
      console.log(post_list); // 데이터에 잘 들어갔는지 확인

      if (getState().user.user) {
        dispatch(setIsLike(post_list));
      } else {
        dispatch(setPost(post_list));
      }


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
      }).catch((error) => {
        window.alert('앗, 이미지 업로드에 문제가 있어요');
        console.log('앗, 이미지 업로드에 문제가 있어요', error);
      })
    })




  }
}

// 좋아요 토글하는 함수
const toggleLikeFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    // 유저 정보가 없으면 실행하지 않기
    if (!getState().user.user) {
      window.alert('로그인 후 이용가능합니다.');
      return;
    }

    const postDB = firestore.collection("magazine");
    const likeDB = firestore.collection("like");

    const _index = getState().post.list.findIndex((p) => p.id === post_id); // post 찾기 위해 배열의 몇 번쨰에 있는지 확인
    const _post = getState().post.list[_index]; // post 정보 가져오기
    const user_id = getState().user.user.uid; // user id 가져오기


    // 좋아요 해제하기 (좋아요 상태인 경우) 1. likeDB에서 해당 데이터를 지우고, 2. postDB에서 like_cnt를 -1해주기
    if (_post.is_like) {
      likeDB
        .where("post_id", "==", _post.id)
        .where("user_id", "==", user_id)
        .get()
        .then((docs) => {
          let batch = firestore.batch();

          docs.forEach((doc) => {
            batch.delete(likeDB.doc(doc.id));
          });

          batch.update(postDB.doc(post_id), {
            like_cnt:
              _post.like_cnt - 1 < 1 ? 0 : _post.like_cnt - 1,
            is_like: false
          });

          batch.commit().then(() => {
            // 이제 리덕스 데이터를 바꿔줘요!
            dispatch(likeToggle(post_id, !_post.is_like));
          });

        }).catch((err) => {
          console.log(err);
        });
    } else {
      // 좋아요 하기 (좋아요 해제 상태인 경우) 1. likeDB에 해당 데이터를 넣고, 2. postDB에서 like_cnt를 +1해주기
      likeDB.add({ post_id: post_id, user_id: user_id }).then(doc => {
        postDB.doc(post_id).update({ like_cnt: _post.like_cnt + 1, is_like: true }).then(doc => {
          dispatch(likeToggle(post_id, !_post.is_like));
        });
      });
    }
  };
};

// 좋아요 리스트를 가져와서 리덕스에 넣어주는 함수
const setIsLike = (_post_list) => {
  return function (dispatch, getState, { history }) {
    // 로그인하지 않았을 땐 리턴!
    if (!getState().user.is_login) {
      return;
    }

    // 좋아요 리스트 가져오기 
    // 1. post_list에 들어있는 게시물의 좋아요 리스트를 가져오고,
    // 2. 지금 사용자가 좋아요를 했는 지 확인해서, 3. post의 is_like에 넣어줄거예요!
    const likeDB = firestore.collection("like");
    const post_ids = _post_list.map((p) => p.id);

    // query를 써줍니다!
    // 저는 post_id를 기준으로 가져올거예요.
    let like_query = likeDB.where("post_id", "in", post_ids);
    like_query.get().then((like_docs) => {

      // 파이어스토어에서 가져온 데이터를 {}로 만들어줄거예요.
      let like_list = {};
      like_docs.forEach((doc) => {


        // like_list에 post_id로 된 키가 있다면?
        // 있으면 배열에 기존 배열 + 새로운 user_id를 넣고,
        // 없으면 새 배열에 user_id를 넣어줍니다! :)
        if (like_list[doc.data().post_id]) {
          like_list[doc.data().post_id] = [
            ...like_list[doc.data().post_id],
            doc.data().user_id,
          ];
        } else {
          like_list[doc.data().post_id] = [doc.data().user_id];
        }
      });

      // like = {post_id: [user_id, user_id, user_id]}

      console.log(like_list);

      // user_id 가져오기!
      const user_id = getState().user.user.uid;
      let post_list = _post_list.map((p) => {
        // 만약 p 게시글을 좋아요한 목록에 로그인한 사용자 id가 있다면?
        if (like_list[p.id] && like_list[p.id].indexOf(user_id) !== -1) {
          // is_like만 true로 바꿔서 return 해줘요!
          return { ...p, is_like: true };
        }

        return p;
      });
      dispatch(setPost(post_list));

    });
  };
};

// Reducer
export default handleActions(
  {
    [SET_POST]: (state, action) => produce(state, (draft) => {
      draft.list = action.payload.post_list;

      draft.list = draft.list.reduce((acc, cur) => {
        if (acc.findIndex((a) => a.id === cur.id) === -1) {
          return [...acc, cur];
        } else {
          acc[acc.findIndex((a) => a.id === cur.id)] = cur;
          return acc;
        }
      }, []);
    }),

    [ADD_POST]: (state, action) => produce(state, (draft) => {
      draft.list.unshift(action.payload.post);
    }),

    [EDIT_POST]: (state, action) => produce(state, (draft) => {
      // 배열의 몇 번째에 있는 지 찾는다
      let index = draft.list.findIndex((p) => p.id === action.payload.post_id);
      // 해당 위치에 넣어준다
      draft.list[index] = { ...draft.list[index], ...action.payload.post };
    }),

    [LIKE_TOGGLE]: (state, action) => produce(state, (draft) => {
      let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
      draft.list[idx].is_like = action.payload.is_like;
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
  getOnePostFB,
  toggleLikeFB,
}

export { actionCreators };