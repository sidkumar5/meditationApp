import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ListItem, Button, Avatar } from "react-native-elements";
import firebase from "../Firebase";
import Icon from "react-native-vector-icons/FontAwesome";

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {};
  };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    this.setState({ isLoading: false });
  };

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Button
          style={styles.button}
          title="Developer Interface"
          onPress={() => {
            this.props.navigation.navigate("Timer");
          }}
        />
        <Button
          style={styles.button}
          title="User InterFace"
          onPress={() => {
            this.props.navigation.navigate("uTimer");
          }}
        />
        <Button
          style={styles.button}
          title="Past Meditations"
          onPress={() => {
            this.props.navigation.navigate("history");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: { padding: 20, flex: 1, height: 1000 },
  detailButton: {
    marginTop: 10,
    flexDirection: "row",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    //justifyContent: "space-around",
    //justifyContent: "space-between",
  },
});

export default HomeScreen;
