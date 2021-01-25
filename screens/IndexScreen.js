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

export default function IndexScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);

const posts = [].concat(title, content);

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

  function addPost() {
    navigation.navigate("NewPost");
  };

  function editPost(id) {
    navigation.navigate("EditPost", id);
  };

  function dismissKeyboard() {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
      console.log("---- Getting posts ----");
      dismissKeyboard();
  
      try {
        const response = await axios.get(API + API_ALL, {
          id,
          title,
          content,
        });
        console.log("Success getting posts");
        console.log(response);
        setTitle(response.data.title);
        setContent(response.data.content);
        AsyncStorage.setItem(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error getting posts");
        console.log(error.response);
        setErrorText(error.response.data.description);
      }
    };
        
 


 async function deletePost(id) {
    console.log("---- Deleting post ----");
    dismissKeyboard()

    try {
      const response = await axios.delete(API + API_DELETE + id, {
        id,
        title,
        content,
      });
      console.log("Success deleting post " + id);
      console.log(response);
      setTitle(response.data.title);
      setContent(response.data.content);
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
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.text}>{item.title}</Text>
        <Text style={styles.text}>{item.content}</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deletePost(item.id)}>
          <Ionicons name="trash" size={16} color="#944" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => editPost(item.id)}>
        <FontAwesome name="edit" size={16} color="black" />
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    );
  }


  return (
      <View style={styles.container}>
      {loading ? (
            <ActivityIndicator style={{ marginBottom: 20, marginLeft: 30 }} />
          ) : null}
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id} />
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
    marginLeft: 5,
    paddingLeft: 5
  },
  deleteBtn: {
    marginLeft: 5,
    paddingLeft: 5,
  },
});