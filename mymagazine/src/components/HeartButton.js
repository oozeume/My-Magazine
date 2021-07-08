import React from "react";
import styled from "styled-components";

import heart_pink from "../shared/heart_pink.png";
import heart_gray from "../shared/heart_gray.png";

const HeartButton = (props) => {
  const icon_url = props.is_like? heart_pink : heart_gray;

  return (
    <React.Fragment>
      <Heart onClick={props._onClick} icon_url={icon_url}></Heart>
    </React.Fragment>
  );
};

const Heart = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  background: url(${(props) => props.icon_url});
  background-size: cover;
  cursor: pointer;
`;

export default HeartButton;