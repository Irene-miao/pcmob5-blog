import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "http://Irene2miao.pythonanywhere.com/";
const API_SHOW = "/posts/<int:id>";

export default function IndexScreen({ navigation }) {
  const isDarkModeOn = useSelector((state) => state.prefs.darkMode);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function getPost() {
    console.log("---- Getting the post ----");

    try {
      setLoading(true);
      const response = await axios.get(API + API_SHOW, {
        title,
        content,
      });
      console.log("Success getting the post");
      console.log(response);
      await AsyncStorage.setItem(response.data);
    } catch (error) {
      console.log("Error getting the post");
      console.log(error.response);
      setErrorText(error.response.data.description);
    } finally {
      setLoading(false);
    }
  }

  return (
          <View
          style={[commonStyles.container,
            isDarkModeOn && { backgroundColor: "black"},
            ]}
          >
            <Text>{title}</Text>
            <Text>{content}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("EditBlog")} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>{errorText}</Text>
          </View>
    );
  }

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: "red",
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
