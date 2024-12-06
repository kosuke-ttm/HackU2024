import React , { useState } from "react";
import { Text, TextInput, Button, View, StyleSheet, Alert } from "react-native";
import { auth } from "../script/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter} from "expo-router";

// メイン画面
export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter(); // useRouterでrouterを取得

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // 登録成功
        Alert.alert("ユーザー登録成功！");
        console.log("user info:", userCredential);
        router.push("/home");
      })
      .catch((error) => {
        // エラー処理
        Alert.alert("登録エラー:",error.message)
        console.error('Registration error:', error);
        return;
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ログイン成功
        console.log('User logged in:', userCredential.user.email);
        Alert.alert("ログイン成功！！")
        router.push("/home");
      })
      .catch((error) => {
        // エラー処理
        Alert.alert("ログインエラー:",error.message);
        console.error('Login error:', error);
        return;
      });
  };
  return (
    <View style={styles.titleContainer}>
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="新規登録" onPress={handleSignUp} />
      <Button title="ログイン" onPress={handleSignIn} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

// スタイル
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column", // 縦に並べる
    padding: 20,
  },
  postContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: 14,
    color: "#666",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  message: {
    marginTop: 20,
    color: 'red',
  },
});