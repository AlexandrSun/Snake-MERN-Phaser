import React, {useEffect, useState} from "react";

export const Button = ({
                           text = '',
                           active = false,
                           handler = () => {},
                           centered = false}) => {
    const [isActive, setIsActive] = useState('inactive');

    useEffect(()=> {
        if (active) {
            setIsActive('active');
        } else {
            setIsActive('inactive');
        }
    }, [active]);

    return (
            <button
                className={`button button-${isActive} button-${centered && 'centered'}`}
                onClick={handler}>
                {text}
            </button>
    )
};