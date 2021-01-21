import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import TimerScreen from "./components/TimerScreen";
import TimerDetailScreen from "./components/TimerDetailScreen";
import EditTaskScreen from "./components/EditTaskScreen";
import AddTaskScreen from "./components/AddTaskScreen";
import AddTimerScreen from "./components/AddTimerScreen";
import EditTimerScreen from "./components/EditTimerScreen";
import RunTimerScreen from "./components/RunTimerScreen";
import HomeScreen from "./components/HomeScreen";
import uTimerScreen from "./components/uTimerScreen";
import MeditationHistoryScreen from "./components/MeditationHistory";
//hi

const RootStack = createAppContainer(
  createStackNavigator(
    {
      Timer: TimerScreen,
      TimerDetails: TimerDetailScreen,
      AddTimer: AddTimerScreen,
      EditTask: EditTaskScreen,
      AddTask: AddTaskScreen,
      EditTimer: EditTimerScreen,
      RunTimer: RunTimerScreen,
      Home: HomeScreen,
      uTimer: uTimerScreen,
      history: MeditationHistoryScreen,
    },
    {
      initialRouteName: "Home",
      navigationOptions: {
        headerStyle: {
          backgroundColor: "#777777",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      },
    }
  )
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
