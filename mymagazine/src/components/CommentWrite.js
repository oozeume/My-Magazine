import React from "react";

import Button from "../elements/Button";
import Input from "../elements/Input";
import Grid from "../elements/Grid";

const CommentWrite = () => {

    return (
        <React.Fragment>
            <Grid padding="16px" is_flex>
                <Input placeholder="댓글 내용을 입력해주세요 :)" />
                <Button width="50px" margin="0px 2px 0px 2px">작성</Button>
            </Grid>
        </React.Fragment>
    );
}

export default CommentWrite;