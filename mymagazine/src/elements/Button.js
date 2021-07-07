import React from "react";
import styled from "styled-components";


const Button = (props) => {
  const { text, width, _onClick, color, padding, margin, children, bg, is_float } = props;

  const styles = {
    width: width,
    color: color,
    padding: padding,
    margin: margin,
    bg: bg,
    text: text,
  }

  if (is_float) {
    return (
      <React.Fragment>
        <FloatBtn onClick={_onClick}>{text? text : children}</FloatBtn>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ElementBtn {...styles} onClick={_onClick}>
        {text ? text : children}
      </ElementBtn>
    </React.Fragment>
  );
}

Button.defaultProps = {
  text: 'false',
  width: '100%',
  _onClick: () => { },
  bg: 'black',
  padding: '12px 0px',
  margin: '0px',
  children: null,
  is_float: false,
}

const ElementBtn = styled.button`
  width: ${(props) => props.width};
  color: ${(props) => props.color};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  border: none;
  box-sizing: border-box;
  background-color: ${(props) => props.bg};
`;

const FloatBtn = styled.button`
  width: 50px;
  height: 50px;
  background-color: purple;
  color: #ffffff;
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 800;
  position: fixed;
  bottom: 50px;
  right: 16px;
  text-align: center;
  vertical-align: middle;
  border: none;
  border-radius: 50px;
`;

export default Button;