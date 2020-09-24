import React, {useCallback, useEffect, useState} from "react";
import {Button} from "../components/Button";

export const ScorePage = () => {
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRating = useCallback(async () => {
        try {
            const response = await fetch('/api/score');
            const data = await response.json();

            setScore(data);
            setLoading(false);
            console.table(data);
            return data;

        } catch (e) {}
    }, []);

    useEffect(() => {
        fetchRating()
    }, [fetchRating]);


    if (loading || !score) {
        return <div className='loader'/>
    }

    return (
        <div >
            <a href='/game'>
                <Button
                    text='New Game'
                    active
                    centered
                />
            </a>


            <table className='rating-table'>
                <thead>
                <tr>
                    <th>Rating</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>ID</th>
                </tr>
                </thead>

                <tbody>
                { score.map((item, index) => {
                    return (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td className='rating-table-left'>{item.name}</td>
                            <td>{item.score}</td>
                            <td>{item.id}
                            </td>
                        </tr>
                    )
                }) }
                </tbody>
            </table>
        </div>
    )
};