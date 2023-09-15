import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { Colors } from "../styles/colors";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

interface HeaderProps {
    reloadGame: () => void;
    pauseGame: () => void;
    children: JSX.Element;
    isPaused: boolean;
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Header({
    children,
    reloadGame,
    pauseGame,
    isPaused,
}: HeaderProps): JSX.Element {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={reloadGame}>
                <Ionicons name="reload" size={35} color={Colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={pauseGame}>
                <AntDesign name={isPaused ? "playcircleo" : "pausecircleo"} size={35} color={Colors.secondary} />
            </TouchableOpacity>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: Colors.secondary,
        borderWidth: 5,
        borderRadius: 10,
        borderBottomWidth: 0,
        padding: 15,
        backgroundColor: Colors.primary,
        width: screenWidth * 90 / 100,
    }
})