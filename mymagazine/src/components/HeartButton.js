import React from "react";
import styled from "styled-components";

import heart_pink from "../shared/heart_pink.png";
import heart_gray from "../shared/heart_gray.png";

const HeartButton = (props) => {
  return (
    <React.Fragment>
      <Heart icon_url={heart_gray}></Heart>
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