import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";

const API = "https://Irene2miao.pythonanywhere.com";
const API_WHOAMI = "/whoami";

export function useUsername() {
    const [username, setUsername] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            console.log(token);
            if (token == null) {
              setError(true);
              setUsername(null);
        } else {
            try {
                const response = await axios.get(API + API_WHOAMI, {
                    headers: { Authorization: `JWT ${token}` },
                  });
                  setUsername(response.data.username);
                  setLoading(false);
                } catch (e) {
                  setError(true);
                  setUsername(null);
                  setLoading(false);
            }
        }
    }) ();
        setRefresh(false);
      } , [refresh]);
    
    return [username, loading, error, setRefresh];
}