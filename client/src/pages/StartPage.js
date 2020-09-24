import React, {useState} from "react";
import { IonPhaser } from '@ion-phaser/react'
import { mainGame } from "../phaser/snake";

export const StartPage = () => {
    const [gameState] = useState({
        initialize: true,
        game: mainGame
    });
    const { initialize, game } = gameState;

    return (
        <div className='game-wrapper'>
            <div className='wrapper'>
                <IonPhaser game={game} initialize={initialize} />
            </div>
        </div>
    )
};