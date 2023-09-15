import * as React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, BackHandler, Dimensions } from 'react-native';
import { Colors } from '../styles/colors';
import { PanGestureHandler } from "react-native-gesture-handler"
import { Coordinate, Direction, GestureEventType } from '../types/types';
import Snake from './Snake';
import { checkGameOver } from '../utils/checkGameOver';
import Food from './Food';
import { checkEatsFood } from '../utils/checkEatsFood';
import { randomFoodPosition } from '../utils/randomFoodPosition';
import * as SplashScreen from "expo-splash-screen";
import Header from './Header';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = {
    xMin: 0.002219999 * screenWidth,
    xMax: 0.083 * screenWidth,
    yMin: 0.00125 * screenHeight,
    yMax: 0.07252 * screenHeight,
};
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

SplashScreen.preventAutoHideAsync();

export default function Game(): JSX.Element {
    const [direction, setDirection] = React.useState<Direction>(Direction.Right);
    const [snake, setSnake] = React.useState<Coordinate[]>(SNAKE_INITIAL_POSITION);
    const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
    const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
    const [isPaused, setIsPaused] = React.useState<boolean>(false);
    const [score, setScore] = React.useState<number>(0);

    setTimeout(async () => {
        await SplashScreen.hideAsync();
    }, 500);

    React.useEffect(() => {
        if (!isGameOver) {
            const intervalId = setInterval(() => {
                !isPaused && moveSnake();
            }, MOVE_INTERVAL)
            return () => clearInterval(intervalId);
        }
    }, [snake, isGameOver, isPaused])

    const moveSnake = () => {
        const snakeHead = snake[0];
        const newHead = { ...snakeHead } //copy

        const gameOverMessage = () => {
            Alert.alert('OOOPS...', 'What`s Up loser?', [{
                text: "Prove you`re not a loser",
                onPress: () => { reloadGame() },
                style: 'default'
            },
            {
                text: "you`re a loser",
                onPress: () => { BackHandler.exitApp() },
                style: 'cancel',
            }])
        }

        if (checkGameOver(snakeHead, GAME_BOUNDS)) {
            setIsGameOver((prev) => !prev)
            gameOverMessage()
            return;
        }

        switch (direction) {
            case Direction.Up:
                newHead.y -= 1;
                break;
            case Direction.Down:
                newHead.y += 1;
                break;
            case Direction.Left:
                newHead.x -= 1;
                break;
            case Direction.Right:
                newHead.x += 1;
                break;
            default:
                break;
        }

        if (checkEatsFood(newHead, food, 2)) {
            setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
            setSnake([newHead, ...snake]);
            setScore(score + SCORE_INCREMENT);
        } else {
            setSnake([newHead, ...snake.slice(0, -1)])
        }

    };

    const handleGesture = (event: GestureEventType) => {
        const { translationX, translationY } = event.nativeEvent

        if (Math.abs(translationX) > Math.abs(translationY)) {
            if (translationX > 0) {
                setDirection(Direction.Right)
            } else {
                setDirection(Direction.Left)
            }
        } else {
            if (translationY > 0) {
                setDirection(Direction.Down)
            } else {
                setDirection(Direction.Up)
            }
        }
    }

    const pauseGame = () => {
        setIsPaused(!isPaused);
    }

    const reloadGame = () => {
        setSnake(SNAKE_INITIAL_POSITION);
        setFood(FOOD_INITIAL_POSITION);
        setIsGameOver(false);
        setScore(0);
        setDirection(Direction.Right);
        setIsPaused(false);
    };

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={style.container}  >

                <Header reloadGame={reloadGame} isPaused={isPaused} pauseGame={pauseGame} >
                    <Text style={{ color: "#EEEEEE", fontSize: 20, fontWeight: 'bold' }}>
                        {score}
                    </Text>
                </Header>
                <View style={style.boundaries}>
                    <Snake snake={snake} />
                    <Food x={food.x} y={food.y} />
                </View>
            </SafeAreaView>
        </PanGestureHandler>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    boundaries: {
        flex: 0.8,
        backgroundColor: Colors.primary,
        borderColor: Colors.secondary,
        borderWidth: 5,
        borderRadius: 10,
        width: screenWidth * 90 / 100,
    },


})