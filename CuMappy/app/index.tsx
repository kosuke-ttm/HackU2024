import { Text, View, StyleSheet } from "react-native";
import db from "../script/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

interface Post {
  title: string;
  text: string;
}

export default function Index() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const postData = collection(db, "posts");

    // Firestoreからデータを非同期に取得
    getDocs(postData).then((snapShot) => {
      const postsData = snapShot.docs.map((doc) => {
        return doc.data() as Post; // 型を指定してデータを処理
      });
      setPosts(postsData);
    });

    // Firestoreのリアルタイム更新を監視
    const unsubscribe = onSnapshot(postData, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => {
        return doc.data() as Post;
      });
      setPosts(postsData);
    });

    // コンポーネントがアンマウントされるときにリスナーを解除
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.titleContainer}>
      {posts.length === 0 ? (
        <Text>データがありません</Text>
      ) : (
        posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.text}>{post.text}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column', // 縦に並べる
    padding: 20,
  },
  postContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
});