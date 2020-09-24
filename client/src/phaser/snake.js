import Phaser from "phaser";
import {sendRecord} from "../hooks/sendRecord";

var snake;
var coin;
var cursors;

let localUser;
var score;
var scoreText;
var timer;
var timerEvent;
var timerText;
var level;
var levelText;
var textStyle = { fontFamily: 'Roboto',fontSize: '24px', fill: '#fff' };

var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

class GameScene extends Phaser.Scene {
    constructor ()
    {
        super({key: 'gameScene'});
    }

    preload () {
        this.load.image('coin', 'assets/coin.png');
        this.load.image('player', 'assets/player.png');
    }

    create () {
        score = 0;

        scoreText = this.add.text(30, 10, 'Score: ' + score, textStyle);
        timerText = this.add.text(310, 10, 'Timer: 60', textStyle);
        levelText = this.add.text(600, 10, 'Level: ' + level, textStyle);

        timerEvent = this.time.delayedCall(60000, timeOut, [], this);

        function timeOut () {
            this.scene.start('finalScene')
        }


        var Coin = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize: function Coin (scene, x, y) {
                    Phaser.GameObjects.Image.call(this, scene);

                    this.setTexture('coin');
                    this.setPosition(x * 36, y * 36);
                    this.setOrigin(-0.143);
                    // ((18 snake size / 14 coin size ) -1 integer cell )/ 2 two sides = 0.1428

                    scene.children.add(this);
                },

            eat: function () {
                score++;
                scoreText.setText('Score: '+ score);
            },
        });
        var Snake = new Phaser.Class({

            initialize:

                function Snake (scene, x, y) {
                    this.headPosition = new Phaser.Geom.Point(x, y);

                    this.body = scene.add.group();

                    this.head = this.body.create(x * 18, y * 18, 'player');
                    this.head.setOrigin(0);

                    this.alive = true;

                    this.speed = (level <= 8) ? (100 - level*10) : 20;

                    console.log(this.speed);

                    this.moveTime = 0;

                    this.tail = new Phaser.Geom.Point(x, y);

                    this.heading = RIGHT;
                    this.direction = RIGHT;
                },

            update: function (time) {
                if (time >= this.moveTime)
                {
                    return this.move(time);
                }
            },

            faceLeft: function () {
                if (this.direction === UP || this.direction === DOWN)
                {
                    this.heading = LEFT;
                }
            },

            faceRight: function () {
                if (this.direction === UP || this.direction === DOWN)
                {
                    this.heading = RIGHT;
                }
            },

            faceUp: function () {
                if (this.direction === LEFT || this.direction === RIGHT)
                {
                    this.heading = UP;
                }
            },

            faceDown: function () {
                if (this.direction === LEFT || this.direction === RIGHT)
                {
                    this.heading = DOWN;
                }
            },

            move: function (time) {

                switch (this.heading) {
                    case LEFT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                        break;

                    case RIGHT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                        break;

                    case UP:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                        break;

                    case DOWN:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                        break;

                    default:
                        break;
                }

                this.direction = this.heading;

                //  Update the body segments and place the last coordinate into this.tail
                Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 18, this.headPosition.y * 18, 1, this.tail);
                //  Check to see if any of the body pieces have the same x/y as the head
                //  If they do, the head ran into the body

                var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

                if (hitBody) {
                    //  Game Over
                    this.alive = false;
                    return false;
                }
                else
                {
                    //  Update the timer ready for the next movement
                    this.moveTime = time + this.speed;

                    return true;
                }
            },

            grow: function () {
                var newPart = this.body.create(this.tail.x, this.tail.y, 'player');

                newPart.setOrigin(0);
            },

            collideWithCoin: function (coin) {
                if (this.head.x === coin.x && this.head.y === coin.y)
                {
                    this.grow();
                    coin.eat();
                    return true;
                }
                else
                {
                    return false;
                }
            },

            updateGrid: function (grid)
            {
                //  Remove all body pieces from valid positions list
                this.body.children.each(function (segment) {

                    var bx = segment.x / 18;
                    var by = segment.y / 18;

                    grid[by][bx] = false;

                });

                return grid;
            }

        });

        coin = new Coin(this, 3, 4);

        snake = new Snake(this, 8, 8);

        //  Create our keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
    }

    update (time, delta) {

        if (!snake.alive)
        {
            this.scene.start('finalScene');
            return;
        } else {
            timer = 60 - Math.floor(timerEvent.getElapsedSeconds());
            if (timer > 0) {
                timerText.setText('Timer: '+ timer);
            }
        }

        if (cursors.left.isDown)
        {
            snake.faceLeft();
        }
        else if (cursors.right.isDown)
        {
            snake.faceRight();
        }
        else if (cursors.up.isDown)
        {
            snake.faceUp();
        }
        else if (cursors.down.isDown)
        {
            snake.faceDown();
        }

        if (snake.update(time))
        {
            //  If the snake updated, we need to check for collision against coin

            if (snake.collideWithCoin(coin))
            {
                repositionCoin();
            }
        }
    }
}

function repositionCoin () {
    //  First create an array that assumes all positions
    //  are valid for the new piece of coin

    //  A Grid we'll use to reposition the coin each time it's eaten
    let testGrid = [];

    for (let y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (let x = 0; x < 40; x++)
        {
            testGrid[y][x] = true;
        }
    }

    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (let y = 0; y < 30; y++)
    {
        for (let x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                //  Is this position valid for coin? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }

    if (validLocations.length > 0)
    {
        //      //  Use the RNG to pick a random coin position
        //      //  Not work with ION lib !!!
        // let pos = Phaser.Math.RND.pick(validLocations);
        let arrayPick = Math.floor(Math.random() * Math.floor(validLocations.length));

        let pos = validLocations[arrayPick];

        //  And place it
        coin.setPosition(pos.x * 18, pos.y * 18);
        return true;
    }
    else
    {
        return false;
    }
}


class FinalScene extends Phaser.Scene {
    constructor() {
        super({key: 'finalScene'});
    }

    preload () {
        localUser = JSON.parse(localStorage.getItem('user'));
    }

    create () {

        let nextRestartText;

        if (level*5 <= score && snake.alive) {
            // WIN
            nextRestartText = 'Next level';
            this.add.text(250, 120, 'You WIN!', {fontFamily: 'Roboto',fontSize: '50px', fill: '#00AB19'});
        } else {
            // LOSE
            nextRestartText = 'Restart';
            this.add.text(235, 120, 'Game over!', {fontFamily: 'Roboto',fontSize: '50px', fill: '#ff1215'});
        }

        this.add.text(232, 200, 'Your score: ' + score + ' / ' + (level*5), {fontFamily: 'Roboto',fontSize: '32px', fill: '#ffffff'});
        this.add.text(265, 260, 'Your level: ' + level, {fontFamily: 'Roboto',fontSize: '32px', fill: '#ffffff'});

        var restartBtnConfig = {
            x: 190,
            y: 360,
            padding: 12,
            text: nextRestartText,
            style: {
                fontSize: '26px',
                fontFamily: 'Roboto',
                color: '#ffffff',
                backgroundColor: '#00ab19',
            }
        };
        var restartBtn = this.make.text(restartBtnConfig).setInteractive();

        restartBtn.on('pointerdown', async () => {
            if (nextRestartText === 'Next level') {
                localStorage.setItem('level', level + 1);
                await sendRecord({...localUser, score});
                level++;
            }
            this.scene.start('gameScene');
        });

        var ratingBtnConfig = {
            x: 410,
            y: 360,
            padding: 12,
            text: 'Top Scores',
            style: {
                fontSize: '26px',
                fontFamily: 'Roboto',
                color: '#ffffff',
                backgroundColor: '#F18D00',
            }
        };
        var ratingBtn = this.make.text(ratingBtnConfig).setInteractive();

        ratingBtn.on('pointerdown', async () => {
            if (nextRestartText === 'Next level') {
                localStorage.setItem('level', level + 1);
                await sendRecord({...localUser, score});
            }
            window.location.href = '/score';
        });
    }
}

class StartScene extends Phaser.Scene {
    constructor() {
        super({key: 'startScene'});
    }

    preload () {
        this.level = localStorage.getItem('level');
    }
    create () {
        this.scene.add('gameScene', GameScene, false);
        this.scene.add('finalScene', FinalScene, false);

        if (this.level) {
            level = +this.level;
            var continueGameBtnCfg = {
                x: 262,
                y: 260,
                padding: 12,
                text: 'Continue game',
                style: {
                    fontSize: '26px',
                    fontFamily: 'Roboto',
                    color: '#ffffff',
                    backgroundColor: '#00ab19',
                }
            };
            var continueGameBtn = this.make.text(continueGameBtnCfg).setInteractive();
            continueGameBtn.on('pointerdown', () => {
                this.scene.start('gameScene');
            });
        }

        var startNewGameBtnCfg = {
            x: 255,
            y: 180,
            padding: 12,
            text: 'Start New Game',
            style: {
                fontSize: '26px',
                fontFamily: 'Roboto',
                color: '#ffffff',
                backgroundColor: '#F18D00',
            }
        };
        var startNewGameBtn = this.make.text(startNewGameBtnCfg).setInteractive();
        startNewGameBtn.on('pointerdown', () => {
            level = +1;
            this.scene.start('gameScene');
        });
    }
}


// export let mainGame = new Phaser.Game({
//     width: 720,
//     height: 540,
//     type: Phaser.AUTO,
//     backgroundColor: '#555555',
//     scale: {
//         mode: Phaser.Scale.NONE,
//         autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
//     },
//     scene: [StartScene, GameScene, FinalScene]
// });

export const mainGame = {
    width: 720,
    height: 540,
    type: Phaser.AUTO,
    backgroundColor: '#555555',
    scene: StartScene
};