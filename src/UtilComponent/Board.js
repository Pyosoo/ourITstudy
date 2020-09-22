import React from 'react';
import './Board.css';
function Board(props){
    return(
        <div className="Board_Box">
            <h2>{props.writer}</h2>
            <h4>{props.title}</h4>
            <h5>{props.content}</h5>
        </div>
    )
}

export default Board;