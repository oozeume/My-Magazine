import React from "react";
import styled from "styled-components";


const Button = (props) => {
  const { text, width, _onClick, color, padding, margin, children, bg } = props;

  const styles = {
    width: width,
    color: color,
    padding: padding,
    margin: margin,
    bg: bg,
  }

  return (
    <div>
      <ElementBtn {...styles} onClick={_onClick}>
        {text ? text : children}
      </ElementBtn>
    </div>
  )

}

Button.defaultProps = {
  text: false,
  width: '100%',
  _onClick: () => { },
  bg: 'black',
  padding: '12px 0px',
  margin: '0px',
  children: null,
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

export default Button;