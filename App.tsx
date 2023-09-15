import {GestureHandlerRootView} from "react-native-gesture-handler"
import Game from './src/components/Game';
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <StatusBar hidden={true} />
      <Game />   
    </GestureHandlerRootView>
  );
}

