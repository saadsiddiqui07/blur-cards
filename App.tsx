import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("screen");

const data = [
  "https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200",
];

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
      {/* <Text
        style={{
          position: "absolute",
          top: "10%",
          left: 10,
          color: "#fff",
          fontWeight: "800",
          zIndex: 1,
          fontSize: 22,
        }}
      >
        SOME TITLE
      </Text> */}
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
