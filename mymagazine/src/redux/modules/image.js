import { createAction, handleActions } from "redux-actions"
import produce from "immer";

import { storage } from "../../shared/firebase";


// Action
const UPLODING = "UPLODING"; // 업로드 중인지 아닌지 알게해주는 액션
const UPLOAD_IMAGE = "UPLOAD_IMAGE"; // 파일 업로드 하는 액션
const SET_PREVIEW = "SET_PREVIEW"; // preview이미지 받아서 보내주는 액션

// ActionCreator
const uploding = createAction(UPLODING, (uploading) => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({ image_url }));
const setPreview = createAction(SET_PREVIEW, (preview_image) => ({preview_image}));

// initialState
const initialState = {
  image_url: "http://via.placeholder.com/400x300", // preview_image올리기 전에 보여줄 기본 값
  uploading: false, // 업로드중이니? 기본값은 false
  preview_image: null,
}

// Middleware ActionCreator
const uploadImageFB = (image) => {
  return function (dispatch, getState, { history }) {
    dispatch(uploding(true));

    console.log(`images/${new Date().getTime()}_${image.name}`);
    const _upload = storage.ref(`images/${image.name}`).put(image);
    
    // 업로드 되고 나면! 
    _upload.then((snapshot) => {
      console.log(snapshot);

      // 업로드된 파일의 url을 받아온다. 
      // getDownloadURL은 firebase storage의 내장함수
      snapshot.ref.getDownloadURL().then((url) => {
        console.log(url);
        dispatch(uploadImage(url));
      });
    }).catch(error => {
      dispatch(uploding(false));
    });
  }
}

// Reducer
export default handleActions({
  [UPLODING]: (state, action) => produce(state, (draft) => {
    draft.uploading = action.payload.uploading;
  }),
  [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
    draft.image_url = action.payload.image_url;
    draft.uploading = false;
  }),
  [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
    draft.preview_image = action.payload.preview_image;
  })
}, initialState);

// ActionCreator export
const actionCreators = {
  uploding,
  uploadImage,
  setPreview,
  uploadImageFB,
}

export { actionCreators };