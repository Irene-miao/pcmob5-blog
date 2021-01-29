import React, {useState, useEffect} from "react";
import { StyleSheet,
   Text, 
   View,
   TouchableWithoutFeedback,
   TextInput,
   TouchableOpacity,
   Platform,
   ActivityIndicator,
   } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API = "http://Irene2miao.pythonanywhere.com/";
const API_EDIT = "/posts/";



export default function EditScreen({ navigation, route }) {
  const isDarkModeOn = useSelector((state) => state.prefs.darkMode);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setId(route.params?.id ? route.params.id : "");
  }, [route.params]);

//Update post to DB
  async function updatePost(id, title, content, loading, errorText) {
    console.log("---- Getting the post ----");

    try {
      setLoading(true);
      const response = await axios.put(API + API_EDIT + id,  { data: {
        title: {title},
        content: {content},}
      });
      console.log("Success updating the post");
      console.log(response.data);
      await AsyncStorage.setItem(response.data);
      navigation.navigate("Posts");
    } catch (error) {
      console.log("Error updating the post");
      console.log(error.response);
      setErrorText(error.response.data.description);
    } finally {
      setLoading(false);
    }
  }

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
  
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={[commonStyles.container,
            isDarkModeOn && { backgroundColor: "black"},
            ]}>
             {loading ? (
            <ActivityIndicator style={{ marginBottom: 20, marginLeft: 30 }} />
          ) : null} 
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
        <TouchableOpacity onPress={updatePost} style={styles.updateButton}>
          <Text style={styles.buttonText}>Update</Text>
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
  updateButton: {
    backgroundColor: "green",
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
