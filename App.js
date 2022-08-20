import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function App() {
  const dummyData = Array(50).fill().map((x, i) => { return { id: i, imgUrl: `http://placekitten.com/200/300` } })
  const [people, setPeople] = useState(dummyData)
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderGrant: (e) => {
      position.setOffset({
        x: position.x._value,
        y: position.y._value
      });
    },
    onPanResponderMove: Animated.event(
      [
        null,
        { dx: position.x, dy: position.y }
      ]
    ),
    onPanResponderRelease: (evt, gestureState) => {
    
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
          i==currentIndex && { transform:[{ translateX: position.x }, { translateY: position.y }] },
          {
            height: SCREEN_HEIGHT - 120,
            width: SCREEN_WIDTH,
            padding: 10,
            position: 'absolute'
          }
        ]}
    >
      <Image
        style={{
          flex: 1,
          height: null,
          width: null,
          resizeMode: "cover",
          borderRadius: 20
        }}
        source={{ uri: x.imgUrl }}
      />
    </Animated.View>).reverse()

  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }} />
      <View style={{ flex: 1 }}>
        <Text>
          HI
        </Text>
        {renderPeople()}
      </View>
      <View style={{ height: 60 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
