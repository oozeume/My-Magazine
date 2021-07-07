import React from "react";
import { useState } from "react";

import Button from "../elements/Button";
import Input from "../elements/Input";
import Grid from "../elements/Grid";
import Image from "../elements/Image";
import Text from "../elements/Text";

import Upload from "../shared/Upload";

// import history from "../redux/configStore";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const PostWrite = (props) => {
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state)=> state.image.preview_image);
  const dispatch = useDispatch();

  const { history } = props; // history를 props로 받는 이유는?

  const [contents, setContents] = useState('');

  const changeContents = (e)=>{
    setContents(e.target.value);
  }

  const addPost = () => {
    dispatch(postActions.addPostFB(contents));
  }

  if (!is_login) {
    return (
      <React.Fragment>
        <Text size="36px" bold>
          앗 잠깐
        </Text>
        <Text size="16px" bold>
          로그인 후에만 글을 쓸 수 있어요.
        </Text>
        <Button _onClick={() => {
          history.replace('/login');
        }} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Text size="36px" bold>
        게시글 작성
      </Text>
      <Upload />

      <Grid>
        <Text margin="0px" size="24px" bold>
          Preview
        </Text>
        <Image shape="rectangle" src={
          preview ? preview : "http://via.placeholder.com/400x300"} />
      </Grid>

      <Grid padding="16px">
        <Input label="게시글 내용" placeholder="게시글 작성" multiLine 
          value={contents}
          _onChange={changeContents}
        />
        <Button bg='gray' text="게시글 작성"
          _onClick={addPost}
        ></Button>
      </Grid>
    </React.Fragment>
  );
}
export default PostWrite;