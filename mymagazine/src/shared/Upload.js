import React from 'react';
import { useRef } from 'react';

import styled from 'styled-components';

import Button from '../elements/Button';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as imageActions } from '../redux/modules/image';

const Upload = (props) => {
  const dispatch = useDispatch();
  const uploading = useSelector((state) => state.image.uploading);

  const fileInput = useRef();

  const selectFile = (e) => {
    console.log(e.target); // <input type="file">
    console.log(e.target.files); // FileList {0:File, length: 1}
    console.log(e.target.files[0]); // File 객체 안의 내용 
    console.log(fileInput.current.files[0]); // 우리가 원하는 해당 이미지 파일

    const reader = new FileReader(); // FileReader라는 객체 만들었다
    const file = fileInput.current.files[0];

    // FileReader의 내장함수 onloadend 사용해서 읽기 끝났을때 가져온다. 
    reader.readAsDataURL(file);// 읽기가 끝났을 때 이 이벤트를 받아와야 읽어온 결과값을 받아올 수 있다. 
    reader.onloadend = () => {
      console.log(reader.result);
      // 이 값을 PostWrite.js에서 받아와야한다. -> 리덕스에 이 값을 넣어줘야한다. 
      // 리덕스에 Preview보는 액션 만들어줘야한다.
      dispatch(imageActions.setPreview(reader.result));
    }
  }

  // 이미지를 가지고 storage에 업로드 하기위한 함수(리덕스로 보내서 리덕스에있는 함수가 파이어베이스 스토리지랑 연결)
  const uploadFB = () => {
    if (!fileInput.current || fileInput.current.files.length === 0) {
      window.alert('파일을 선택해주세요');
      return;
    }
    let image = fileInput.current.files[0];
    dispatch(imageActions.uploadImageFB(image));
  }

  return (
    <React.Fragment>
      <Align>
        <input
          type="file"
          ref={fileInput}
          onChange={selectFile}
          disabled={uploading}
        />
        <Button
        margin="10px 0px 10px 0px"
          _onClick={uploadFB} text="사진 업로드 하기" color='#fff'></Button>
      </Align>
    </React.Fragment>
  );
}

const Align = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default Upload;