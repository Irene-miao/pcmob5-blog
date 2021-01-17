import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import IndexScreen from "../screens/IndexScreen";
import CreateScreen from "../screens/CreateScreen";
import ShowScreen from "../screens/ShowScreen";
import EditScreen from "../screens/EditScreen";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BlogStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
            name="Posts"
            component={IndexScreen}
            options={{
                headerLeft: null,
            }}
            />
             <Stack.Screen
            name="NewPost"
            component={CreateScreen}
            options={{
                headerLeft: null,
            }}
            />
             <Stack.Screen
            name="Post"
            component={ShowScreen}
            options={{
                headerLeft: null,
            }}
            />
             <Stack.Screen
            name="EditPost"
            component={EditScreen}
            options={{
                headerLeft: null,
            }}
            />
        </Stack.Navigator>
        
    );
}

export default function TabStack() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="BlogStack" component={BlogStack} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
}