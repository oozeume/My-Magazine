import React from "react";
import styled from "styled-components";


const Grid = (props) => {
    const { width, padding, margin, children, is_flex, _onClick } = props;
    const styles = {
        width: width,
        padding: padding,
        margin: margin,
        is_flex: is_flex,
    }

    return (
        <div>
            <GridBox {...styles} onClick={_onClick}>
                {children}
            </GridBox>
        </div>
    )
}

Grid.defaultProps = {
    width: '100%',
    padding: false,
    margin: false,
    children: null,
    is_flex: false,
    _onClick: ()=>{},
    
}

const GridBox = styled.div`
    width: ${(props) => props.width};
    box-sizing: border-box;
    height: 100%;
    ${(props) => (props.padding ? `padding: ${props.padding}` : '')};
    ${(props) => (props.margin ? `margin: ${props.margin}` : '')};
    ${(props) => (props.is_flex ? `display:flex; align-items: center; justify-content: space-between; ` : '')};
`;

export default Grid;