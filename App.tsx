import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import data from "./data";

const { width } = Dimensions.get("screen");

const imageWidth = width * 0.7;
const imageH = imageWidth * 1.54;
console.log(Platform.OS, width);

const CardBackdrop = ({
  item,
  index,
  scrollX,
}: {
  item: string;
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const animatedImageStyle = useAnimatedStyle(() => {
    // INPUT RANGE : [-SCROLL RIGHT, CENTER, +SCROLL LEFT]
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    return {
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0]),
    };
  });
  return (
    <Animated.Image
      key={`${index}-image`}
      source={{ uri: item }}
      style={[StyleSheet.absoluteFillObject, animatedImageStyle]}
      blurRadius={20}
    />
  );
};

export default function App() {
  const scrollX = useSharedValue(0);

  const scrollXHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={StyleSheet.absoluteFillObject}>
        {data.map((item, idx) => {
          return (
            <CardBackdrop key={idx} index={idx} item={item} scrollX={scrollX} />
          );
        })}
      </View>
      <Animated.FlatList
        data={data}
        keyExtractor={(_, index) => `${index}-img`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        bounces={false}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
        snapToInterval={width}
        scrollEventThrottle={16}
        onScroll={scrollXHandler}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                width,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                key={index}
                source={{ uri: item }}
                style={{ width: imageWidth, height: imageH, borderRadius: 16 }}
              />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
