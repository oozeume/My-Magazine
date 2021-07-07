import React from "react";
import { useEffect } from "react";

import Post from "../components/Post";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";


const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    const user_info = useSelector((state) => state.user.user);
    console.log(post_list);

    useEffect(() => {
        if (post_list.length === 0) {
            dispatch(postActions.getPostFB());
        }
    }, []);


    return (
        <React.Fragment>
            {/* post_list를 props로 다 넘겨주는 작업 */}
            {post_list.map((post, index) => {
                if (post.user_info.user_id === user_info?.uid) {
                    return <Post {...post} key={post.id} />
                } else {
                    return <Post {...post} key={post.id} />
                }
            })}
        </React.Fragment>
    )
}

export default PostList;