import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
  Touchable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { render } from "react-dom";


const API = "https://Irene2miao.pythonanywhere.com";
const API_ALL = "/posts";
const API_DELETE = "/posts/";

export default function IndexScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
  }

  function dismissKeyboard() {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  }

  useEffect(() => {
    (async () => {
      console.log("---- Getting posts ----");
      dismissKeyboard();
  
      try {
        const response = await axios.get(API + API_ALL, {
          id,
          title,
        });
        console.log("Success getting posts!");
        console.log(response);
        setPosts(response.data);
        AsyncStorage.setItem(response.data);
      } catch (error) {
        console.log("Error logging in!");
        console.log(error.response);
  
        setErrorText(error.response.data.description);
      }
    }) ();
    setRefresh(false);
  }, [refresh]);

  return [posts, loading, errorText, setRefresh];


  async function deletePost(id) {
    console.log("---- Deleting post ----");
    dismissKeyboard()

    try {
      const response = await axios.delete(API + API_DELETE + id, {
        id,
        title,
      });
      console.log("Success deleting post " + id);
      console.log(response);
      setPosts(response.data);
      AsyncStorage.setItem(response.data);
    } catch (error) {
      console.log("Error deleting post " + id);
      console.log(error.response);
      setErrorText(error.response.data.description);
    }
  }

  function renderItem({item}) {
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
        <TouchableOpacity onPress={() => navigation.navigate("Post", {...item})}>
        <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deletePost(item.id)}>
          <Ionicons name="trash" size={16} color="#944" />
        </TouchableOpacity>
        <Text style={styles.errorText}>{errorText}</Text>
      </View>
      </TouchableWithoutFeedback>
    )
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
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  text: {
    color: "black",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    height: 40,
  },
});