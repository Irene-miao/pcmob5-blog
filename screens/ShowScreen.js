import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "http://Irene2miao.pythonanywhere.com/";
const API_SHOW = "/posts/";

export default function IndexScreen({ navigation }) {
  const isDarkModeOn = useSelector((state) => state.prefs.darkMode);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorText, setErrorText] = useState("");

  async function getPost() {
    console.log("---- Getting the post ----");

    try {
      setLoading(true);
      const response = await axios.get(API + API_SHOW + id, {
        title,
        content,
      });
      console.log("Success getting the post " + id);
      console.log(response);
      await AsyncStorage.setItem(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      console.log("Error getting the post " + id);
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
              <Text style={styles.time}>
        {loading ? <ActivityIndicator size="large" color="blue" /> : arrival}{" "}
      </Text>
            <Text>{post}</Text>
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
