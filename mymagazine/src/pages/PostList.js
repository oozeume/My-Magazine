import React from "react";
import { useEffect } from "react";
import styled from "styled-components";

import Post from "../components/Post";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    console.log(post_list);

    useEffect(()=>{
        dispatch(postActions.getPostFB());
    }, []);


    return (
        <React.Fragment>
            {/* post_list를 props로 다 넘겨주는 작업 */}
            {post_list.map((post, index) => {
                return <Post {...post} key={post.id} />
            })}
        </React.Fragment>
    )
}

export default PostList;