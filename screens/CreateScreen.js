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
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API = "https://Irene2miao.pythonanywhere.com";
const API_CREATE = "/create";

export default function CreateScreen({ navigation }) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={back}>
          <Ionicons
            name="caret-back"
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

  function back() {
    navigation.navigate("Posts");
  }

  function dismissKeyboard() {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  }

  //Create post to DB
  async function addPost(id, title, content, errorText) {
    console.log("Creating a post");
    dismissKeyboard();

    try {
      const response = await axios.post(API + API_CREATE, {
        title,
        content,
      });
      console.log("Success creating post!");
      console.log(response.data);
      setId(response.data.id),
      setTitle( response.data.title),
      setContent(response.data.content);
      AsyncStorage.setItem(response.data);
      navigation.navigate("Posts");
    } catch (error) {
      console.log("Error creating post!");
      console.log(error.response);
      setErrorText(error.response.data.description);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Blog</Text>
        <Text style={styles.fieldTitle}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={(input) => setTitle(input)}
        />
        <Text style={styles.fieldTitle}>Content</Text>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={(input) => setContent(input)}
        />
        <TouchableOpacity onPress={addPost} style={styles.createButton}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>{errorText}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 24,
  },
  fieldTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 24,
    padding: 4,
    height: 36,
    fontSize: 18,
    backgroundColor: "white",
  },
  createButton: {
    backgroundColor: "blue",
    width: 120,
    alignItems: "center",
    padding: 18,
    marginTop: 12,
    marginBottom: 36,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    height: 40,
  },
});
