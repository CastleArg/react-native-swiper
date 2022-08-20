
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
import dummyData from './data';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function App() {
  const useNativeDriver = false;
  //const dummyData = Array(50).fill().map((x, i) => { return { id: i, imgUrl: `http://placekitten.com/20${i}/300` } })
  const temp = dummyData.map((x, i) => { return { ...x, id: i } })
  const [people, setPeople] = useState(temp)
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: (evt, gerstureState) => true,
    // onPanResponderGrant: (evt, gestureState) => {
    //   position.setOffset({
    //     x: position.x._value,
    //     useNativeDriver: useNativeDriver,
    //   });
    // },
    onPanResponderMove:  Animated.event([null, {  dx: position.x, dy: position.y }], { useNativeDriver: useNativeDriver }),
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        Animated.spring(position, {
          toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
          useNativeDriver: useNativeDriver
        }).start(() => {
          position.x.setValue(0);
          position.y.setValue(0);
          setCurrentIndex((currentIndex)=>currentIndex + 1)
        })
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
          useNativeDriver: useNativeDriver
        }).start(() => {
          position.x.setValue(0);
          position.y.setValue(0);
          setCurrentIndex((currentIndex)=>currentIndex + 1)
        })
      } else {
        Animated.spring(position, {
          useNativeDriver: useNativeDriver,
          toValue: { x: 0, y: 0 },
          friction: 4
        }).start()
      }
    }
  })).current;


  // const panResponderDefault = 
  const renderPeople = () => {
    return people.map((x, i) =>
      i < currentIndex ? null :
        <Animated.View
          {...panResponder?.panHandlers}
          key={i}
          style={
            [
              i == currentIndex && {
                transform: [
                  { translateX: position.x },
                  {
                    rotate: position.x.interpolate({
                      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                      outputRange: ['-10deg', '0deg', '10deg'],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              },
              i > currentIndex && {
                opacity: position.x.interpolate({
                  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                  outputRange: [1, 0, 1],
                  extrapolate: 'clamp'
                }),
                transform: [{
                  scale: position.x.interpolate({
                    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                    outputRange: [1, 0.8, 1],
                    extrapolate: 'clamp'
                  })
                }],
              },
              {
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10,
                position: 'absolute'
              }
            ]}
        >
          {i === currentIndex &&
            <>
              <Animated.View
                style={{
                  transform: [{ rotate: "-30deg" }],
                  opacity: position.x.interpolate({
                    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                    outputRange: [1, 0, 0],
                    extrapolate: 'clamp'
                  }),
                  position: "absolute",
                  top: 50,
                  left: 40,
                  zIndex: 1000
                }}
              >
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "red",
                    color: "red",
                    fontSize: 32,
                    fontWeight: "800",
                    padding: 10
                  }}
                >
                  MEOW
                </Text>
              </Animated.View>
              <Animated.View
                style={{
                  transform: [{ rotate: "30deg" }],
                  position: "absolute",
                  top: 50,
                  right: 40,
                  zIndex: 1000,
                  opacity: position.x.interpolate({
                    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                    outputRange: [0, 0, 1],
                    extrapolate: 'clamp'
                  })
                }}
              >
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: "green",
                    color: "green",
                    fontSize: 32,
                    fontWeight: "800",
                    padding: 10
                  }}
                >
                  MEOW
                </Text>
              </Animated.View>
            </>
          }
          <Image
            style={{
              flex: 1,
              height: null,
              width: null,
              resizeMode: "cover",
              in: 20
            }}
            source={{ uri: x.url }}
          />
        </Animated.View>
    ).reverse()

  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }} />
      <View style={{ flex: 1 }}>
        <Text>
        {/* {`${currentIndex}`} */}
      
      </Text>
        {renderPeople()}
      </View>
      <View style={{ height: 60 }} />
    </View>
  );
}