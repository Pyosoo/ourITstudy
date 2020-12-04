import React, {useEffect, useState} from 'react';
import BoardItem from './BoardItem.js';

// firebase 관련
import firebase from 'firebase';
import { auth } from '../firebase_config';


let database = firebase.database();

function MyBoard() {
    const [listitem, setlistitem] = useState([]);
    console.log('Myboard 실행')
   

    useEffect(() => {
        console.log("MyBoard의 useEffect 실행")
        let showlist = [];
        const getData = () => {
            let reference = database.ref('/');
            reference.on('value', snapshot => {
                showlist=[];
                const data = snapshot.val();
                for (let key in data) {
                    for (let key2 in data[key]) {
                        if (data[key][key2].email === auth.currentUser.email) {
                            showlist.push(
                                <BoardItem
                                    key={key2}
                                    email={data[key][key2].email}
                                    id={key2}
                                    writer={data[key][key2].writer}
                                    title={data[key][key2].title}
                                    content={data[key][key2].content}
                                    position={data[key][key2].position}
                                    region={data[key][key2].region}
                                    likePeople={data[key][key2].likePeople}
                                    number={data[key][key2].number}
                                    likeStatus="no"
                                    day={data[key][key2].day}
                                    mine="yes" />)
                        }
                    }
                }
                if(showlist.length === 0) showlist = [<p key={Math.random()} className="NoDataP">작성한 글이 없습니다.</p>];
                setlistitem(showlist);
            })
        }
        getData();
    }, [])
    return (
        <div>
            {listitem}
        </div>
    )
}

export default MyBoard;