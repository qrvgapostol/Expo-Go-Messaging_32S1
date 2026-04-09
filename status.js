// Status.js
import React from "react";
import { View, Text, Platform, StatusBar, StyleSheet } from "react-native";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo"; // Core API for network info

export default class Status extends React.Component {
  state = {
    info: "none", // initial network state
  };

  componentDidMount() {
    // Get initial connection info
    NetInfo.fetch().then((state) => {
      this.setState({ info: state.type }); // 'wifi', 'cellular', or 'none'
    });

    // Subscribe to connection changes
    this.unsubscribe = NetInfo.addEventListener((state) => {
      this.setState({ info: state.type });
    });
  }

  componentWillUnmount() {
    // Remove listener to prevent memory leaks
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    const { info } = this.state;
    const isConnected = info !== "none";
    const backgroundColor = isConnected ? "white" : "red";

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? "dark-content" : "light-content"}
        animated={false}
      />
    );

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents={"none"}>
        {statusBar}
        {!isConnected && (
          <View style={styles.bubble}>
            <Text style={styles.text}>No network connection</Text>
          </View>
        )}
      </View>
    );

    if (Platform.OS === "ios") {
      return <View style={[styles.status, { backgroundColor }]}>{messageContainer}</View>;
    }

    return messageContainer;
  }
}

const statusHeight = Platform.OS === "ios" ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight + 80, // accommodate message bubble
  },
  messageContainer: {
    zIndex: 1,
    position: "absolute",
    top: statusHeight + 20,
    left: 0,
    right: 0,
    height: 80,
    alignItems: "center",
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "red",
  },
  text: {
    color: "white",
  },
});