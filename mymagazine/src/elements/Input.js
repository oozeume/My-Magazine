import React from "react";
import styled from "styled-components";

import Text from "./Text";

const Input = (props) => {
  const { multiLine, label, placeholder, _onChange, type, value } = props;

  if (multiLine) {
    return (
      <React.Fragment>
        {label && <Text>{label}</Text>}
        <ElementTextarea
          rows={10}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
        ></ElementTextarea>
      </React.Fragment>
    )
  };

  return (
    <React.Fragment>
      {label && <Text >{label}</Text>}
      <ElementInput
        type={type}
        placeholder={placeholder}
        onChange={_onChange}
      ></ElementInput>
    </React.Fragment>
  )
}

Input.defaultProps = {
  multiLine: false,
  label: false,
  placeholder: '텍스트를 입력해주세요',
  _onChange: () => { },
  type: 'text',
  value: '',
}

const ElementInput = styled.input`
  border: 1px solid black;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
`;

const ElementTextarea = styled.textarea`
  border: 1px solid black;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
`;

export default Input;