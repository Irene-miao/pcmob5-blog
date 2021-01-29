import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
 ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons'; 



const API = "https://Irene2miao.pythonanywhere.com";
const API_ALL = "/posts";
const API_DELETE = "/posts/";

export default function IndexScreen({ navigation}) {
  const [posts, setPosts] = useState([]);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color="black"
            style={{
              color: "#f55",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  });

useEffect(() => {
  const posts = []
  getPosts();
}, []);

  function addPost() {
    navigation.navigate("NewPost");
  };

  function editPost(id) {
    navigation.navigate("EditPost", {id: {id}});
  };

  function dismissKeyboard() {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };


  async function getPosts(id, title, content, errorText, loading) {
      console.log("---- Getting posts ----");
      dismissKeyboard();
  //Loads data from flask api
      try {
        const response = await axios.get(API + API_ALL, {
         id,
          title,
          content,
        });
        console.log("Success getting posts");
        console.log(response.data);
        setPosts(response.data);
        AsyncStorage.setItem(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error getting posts");
        console.log(error.response);
        setErrorText(error.response.data.description);
      }
    };
        
 


 async function deletePost(id, title) {
   
    console.log("---- Deleting post ----");
    dismissKeyboard()

    try {
      const response = await axios.delete(API + API_DELETE + id, {data: 
        {
        title: {title},}
      });
      console.log("Success deleting post " + id);
      console.log(response.data);
      const newPosts = posts.filter((item) => item.id !== id);
      setPosts(newPosts);   
      AsyncStorage.setItem(response.data);
    } catch (error) {
      console.log("Error deleting post " + id);
      console.log(error.response);
      setErrorText(error.response.data.description);
    }
  };

  function renderItem({ item }) {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={{
          padding: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Text style={styles.text}>{item.id}</Text>
        <Text style={styles.text}>{item.title}</Text>
        <Text style={styles.text}>{item.content}</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePost(item.id)}>
          <Ionicons name="trash" size={16} color="#944" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => editPost(item.id)}>
        <FontAwesome name="edit" size={16} color="black" />
        </TouchableOpacity>
        <Text style={styles.errorText}>{errorText}</Text>
      </View>
      </TouchableWithoutFeedback>
    );
  };


  return (
      <View style={styles.container}>
      {loading ? (
            <ActivityIndicator style={{ marginBottom: 20, marginLeft: 30 }} />
          ) : null}
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()} />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    height: 40,
  },
  editBtn: {
    marginLeft: 10,
    paddingLeft: 5,
  },
  deleteBtn: {
    marginLeft: 200,
    paddingLeft: 5,
  },
});