import React from 'react';
import './Board.css';
function Board(props){
    return(
        <div className="Board_Box">
            <div className="title_box">{props.title}</div>
            <div className="writer_box">{props.writer}</div>
            <div className="content_box">{props.content}</div>
        </div>
    )
}

export default Board;