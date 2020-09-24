import React, {useState, useEffect} from "react";
import { customAlphabet } from "nanoid";
import {Redirect} from 'react-router-dom';
import {Button} from "../components/Button";

export const Login = () => {
    const [userName, setUserName] = useState('');
    const [activeBtn, setActiveBtn] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const nanoid = customAlphabet('1234567890', 10);

    useEffect(() => {
        if (userName.length > 0) {
            setActiveBtn(true)
        } else {
            setActiveBtn(false);
        }
    }, [userName]);

    useEffect( () => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
            setAuthorized(true);
            setUserName(localUser.name);
        } else {
            setAuthorized(false);
        }
    }, []);

    const startHandler = () => {
        if (!activeBtn) { return }
        if (!authorized) {
            const id = nanoid();
            const user = {name: userName, id};
            localStorage.setItem('user', JSON.stringify(user));
            setRedirect(true);
        }
    };

    const changeHandler = (e) => {
        setUserName(e.target.value);
    };

    return (
        <div className='modal-layout'>
            {redirect && <Redirect to='/game' />}
            {authorized ? (
                <div className="modal">
                    <h3> Welcome back, {userName}! </h3>
                    <Button
                        text='New Game'
                        active={true}
                        handler={()=> {setRedirect(true)}}
                    />
                </div>
            ):(
                <div className="modal">
                    <h3> Hello stranger! Enter your name! </h3>
                    <input
                        className='inputName'
                        type="text"
                        id="userName"
                        name="userName"
                        autoFocus={true}
                        placeholder='Enter your name'
                        onChange={changeHandler}/>
                    <Button
                        text='New Game'
                        active={activeBtn}
                        handler={startHandler}
                    />
                </div>
            )}
        </div>
    )
};