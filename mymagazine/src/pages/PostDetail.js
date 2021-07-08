import React from "react";
import { useEffect } from "react";

import styled from "styled-components";

import Post from "../components/Post";
// import CommentWrite from "../components/CommentWrite";
// import CommentList from "../components/CommentList";

import Grid from "../elements/Grid";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const PostDetail = (props) => {
  const dispatch = useDispatch();
  const id = props.match.params.id;

  const user_info = useSelector((state) => state.user.user);
  const post_list = useSelector((store) => store.post.list);

  const post_index = post_list.findIndex((p) => p.id === id);
  const post = post_list[post_index];

  useEffect(() => {
    if (post) {
      console.log('포스트가 없어');
      return;
    }

    dispatch(postActions.getOnePostFB(id)); // 게시글 하나만 가져오는 함수
  }, []);



  return (
    <React.Fragment>
      <Align>
        <Grid is_flex>
          {post && (<Post {...post} is_me={post.user_info.user_id === user_info?.uid} />)}
        </Grid>
        {/* <CommentWrite /> */}
        {/* <CommentList /> */}
      </Align>
    </React.Fragment>
  )
}

const Align = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`;

export default PostDetail;