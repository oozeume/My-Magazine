import React from "react";

import Button from "../elements/Button";
import Image from "../elements/Image";
import Text from "../elements/Text";

import { history } from "../redux/configStore";


const Post = (props) => {
    return (
        <React.Fragment>
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.nickname}</Text>
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
                <Button width="auto" margin="4px" padding="4px" _onClick={() => {
                    history.push(`/write/${props.id}`);
                }}>
                    수정
                </Button>
            )}

            <Text>{props.contents}</Text>
            <Image shape="rectangle" src={props.image_url} />
            <Text margin="0px" bold>
                댓글 {props.comment_cnt}개
            </Text>

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
    comment_cnt: 10,
    insert_dt: "2021-02-27 10:00:00",
    is_me: false,
};

export default Post;
