import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, } from "react-native";
import * as Location from 'expo-location';


export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('位置情報へのアクセスが許可されていません。');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = '位置情報を取得中...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `緯度: ${location.coords.latitude}\n経度: ${location.coords.longitude}`;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ホーム画面へようこそ！</Text>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});