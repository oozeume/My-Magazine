import React from "react";

import Button from "../elements/Button";
import Input from "../elements/Input";
import Grid from "../elements/Grid";
import Image from "../elements/Image";
import Text from "../elements/Text";

import Upload from "../shared/Upload";

const PostWrite = (props) => {
  return (
    <React.Fragment>
        <Text size="36px" bold>
          게시글 작성
        </Text>
      <Upload/>

      <Grid>
        <Text margin="0px" size="24px" bold>
          Preview
        </Text>
        <Image shape="rectangle" />
      </Grid>

      <Grid padding="16px">
        <Input label="게시글 내용" placeholder="게시글 작성" multiLine />
        <Button bg='gray' text="게시글 작성"></Button>
      </Grid>
    </React.Fragment>
  );
}
export default PostWrite;