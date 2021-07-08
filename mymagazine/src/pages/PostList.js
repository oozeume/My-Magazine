import React from "react";
import { useEffect } from "react";

import styled from "styled-components";

import Post from "../components/Post";
import Grid from "../elements/Grid";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const PostList = (props) => {
  const dispatch = useDispatch();
  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);

  const { history } = props;

  console.log(post_list);

  useEffect(() => {
    if (post_list.length === 0) {
      dispatch(postActions.getPostFB());
    }
  }, []);


  return (
    <React.Fragment>
      <Align>
        <Grid>
          {/* post_list를 props로 다 넘겨주는 작업 */}
          {post_list.map((post, index) => {
            if (post.user_info.user_id === user_info?.uid) {
              return (
                <Grid
                  _onClick={() => {
                    console.log('포스트 클릭했어');
                    history.push(`/post/${post.id}`);
                  }}>
                  <Post {...post} key={post.id} is_me />
                </Grid>
              );
            } else {
              return (
                <Grid
                  _onClick={() => {
                    console.log('포스트 클릭했어');
                    history.push(`/post/${post.id}`);
                  }}>
                  <Post {...post} key={post.id} />
                </Grid>

              );
            }
          })}
        </Grid>
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

export default PostList;