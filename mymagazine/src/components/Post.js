import React from "react";
import styled from "styled-components";

import Button from "../elements/Button";
import Image from "../elements/Image";
import Text from "../elements/Text";
import Grid from "../elements/Grid";
import HeartButton from "./HeartButton";

import { history } from "../redux/configStore";
import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const Post = (props) => {
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Border>
        <Grid is_flex>
          <Grid is_flex>
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.nickname}</Text>
          </Grid>
          <Text>{props.insert_dt}</Text>

        </Grid>
        <Grid is_flex>
          <Text>{props.contents}</Text>
          {props.is_me && (
            <Button color="#fff" text="edit" width="auto" margin="4px" padding="4px"
              _onClick={() => {
                history.push(`/write/${props.id}`);
              }}>
            </Button>
          )}
        </Grid>
        <Image shape="rectangle" src={props.image_url} />

        <Grid is_flex>
          {/* <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text> */}
          <Text margin="0px" bold>
            좋아요 {props.like_cnt}개
          </Text>

          <HeartButton _onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(postActions.toggleLikeFB(props.id));
          }}
          is_like={props.is_like}
          >
          </HeartButton>
        </Grid>
      </Border>
    </React.Fragment>
  )
}

Post.defaultProps = {
  user_info: {
    nickname: "mean0",
    user_profile: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  },
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "고양이네요!",
  // comment_cnt: 10,
  like_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
  is_me: false,
};

const Border = styled.div`
  border: 1px solid black;
  max-width: 450px;
  margin-bottom: 30px;
  padding: 20px;
`;

export default Post;
