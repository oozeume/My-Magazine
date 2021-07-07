import React from "react";
import { useState, useEffect } from "react";

import Button from "../elements/Button";
import Input from "../elements/Input";
import Grid from "../elements/Grid";
import Image from "../elements/Image";
import Text from "../elements/Text";

import Upload from "../shared/Upload";

// import history from "../redux/configStore";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";


const PostWrite = (props) => {
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview_image);
  const post_list = useSelector((state) => state.post.list);
  const dispatch = useDispatch();

  const post_id = props.match.params.id; // 여기 들어온 아이디를 가지고 수정인지 아닌지 확인한다.
  const is_edit = post_id ? true : false;

  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;
  const [contents, setContents] = useState(_post ? _post.contents : '');

  const { history } = props; // history를 props로 받는 이유는?

  // 처음에 렌더링할때 한번만 체크하는 거로 useEffect 사용
  useEffect(() => {
    if (is_edit && !_post) {
      console.log("포스트 정보가 없어요!");
      history.goBack();

      return;
    }

    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);




  const changeContents = (e) => {
    setContents(e.target.value);
  }

  const addPost = () => {
    dispatch(postActions.addPostFB(contents));
  }

  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, { contents: contents }));
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
        {is_edit ? "게시글 수정" : "게시글 작성"}

      </Text>
      <Upload />

      <Grid>
        <Text margin="0px" size="24px" bold>
          Preview
        </Text>
        <Image shape="rectangle"
          src={preview ? preview : "http://via.placeholder.com/400x300"} />
      </Grid>

      <Grid padding="16px">
        <Input label="게시글 내용" placeholder="게시글 작성" multiLine
          value={contents}
          _onChange={changeContents}
        />
        {is_edit ? (<Button bg='gray' text="게시글 수정" _onClick={editPost} ></Button>)
          : (<Button bg='gray' text="게시글 작성" _onClick={addPost} ></Button>)}



      </Grid>
    </React.Fragment>
  );
}
export default PostWrite;