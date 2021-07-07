import React from "react";

import CommentList from "../components/CommentList";
import Post from "../components/Post";
import CommentWrite from "../components/CommentWrite";


const PostDetail = (props) => {

    return (
        <React.Fragment>
            <Post/>
            <CommentWrite/>
            <CommentList/>
        </React.Fragment>
    )
}

export default PostDetail;