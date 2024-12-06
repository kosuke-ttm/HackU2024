import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from "react-native";
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const THRESHOLD_DISTANCE = 100; // メートル単位
const TARGET_LOCATION = { latitude: 35.0000, longitude: 136.0000 }; //ここを変える

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sendImmediateNotification = useCallback(async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // 即時通知
    });
  }, []);

  const checkThreshold = useCallback((location: Location.LocationObject) => {
    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      TARGET_LOCATION.latitude,
      TARGET_LOCATION.longitude
    );
    if (distance <= THRESHOLD_DISTANCE) {
      sendImmediateNotification('位置通知', '指定された地点に近づきました！');
    }
  }, [sendImmediateNotification]);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        setErrorMsg('位置情報へのアクセスが許可されていません。');
        return;
      }

      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        setErrorMsg('通知の許可が得られませんでした。');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,  // 5秒ごとに更新
          distanceInterval: 10,  // 10メートル移動ごとに更新
        },
        (newLocation) => {
          setLocation(newLocation);
          checkThreshold(newLocation);
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [checkThreshold]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // 地球の半径（メートル）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // メートル単位の距離
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ホーム画面へようこそ！</Text>
      <Text style={styles.paragraph}>
        {errorMsg ? errorMsg : location
          ? `緯度: ${location.coords.latitude}\n経度: ${location.coords.longitude}`
          : '位置情報を取得中...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});