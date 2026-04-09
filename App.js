import React from 'react';
import {
  View,
  Button,
  Alert,
  Image,
  TouchableHighlight,
  BackHandler,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import MessageList from './components/MessageList';
import StatusComponent from './components/status';

// Utilities
import {
  createTextMessage,
  createImageMessage,
  createLocationMessage,
} from './components/MessageUtils';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        createTextMessage('Hello'),
        createTextMessage('World'),
        createImageMessage('https://picsum.photos/300'),
        createLocationMessage({ latitude: 37.78825, longitude: -122.4324 }),
      ],
      fullscreenImageId: null,
    };
  }

  // BackHandler setup
  componentWillMount() {
    this.subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    );
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.remove();
    }
  }

  handleBackPress = () => {
    const { fullscreenImageId } = this.state;
    if (fullscreenImageId) {
      this.dismissFullscreenImage();
      return true; // prevent default back action
    }
    return false;
  };

  // Dismiss fullscreen image
  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  // Handle message press
  handlePressMessage = (message) => {
    switch (message.type) {
      case 'text':
        Alert.alert(
          'Delete Message',
          'Do you want to delete this message?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                this.setState((prev) => ({
                  messages: prev.messages.filter((m) => m.id !== message.id),
                }));
              },
            },
          ],
          { cancelable: true }
        );
        break;

      case 'image':
        this.setState({ fullscreenImageId: message.id });
        break;

      default:
        break;
    }
  };

  // Add new messages
  addMessage = (message) => {
    this.setState((prev) => ({ messages: [message, ...prev.messages] }));
  };

  // Render fullscreen image
  renderFullscreenImage = () => {
    const { fullscreenImageId, messages } = this.state;
    if (!fullscreenImageId) return null;

    const imageMessage = messages.find((m) => m.id === fullscreenImageId);
    if (!imageMessage) return null;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
        activeOpacity={1}
      >
        <Image
          style={styles.fullscreenImage}
          source={{ uri: imageMessage.uri }}
        />
      </TouchableHighlight>
    );
  };

  render() {
    const { messages } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusComponent />

        <View style={styles.content}>
          <MessageList
            messages={messages}
            onPressMessage={this.handlePressMessage}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Add Text"
            onPress={() => this.addMessage(createTextMessage('New Text'))}
          />
          <Button
            title="Add Image"
            onPress={() =>
              this.addMessage(createImageMessage('https://picsum.photos/200'))
            }
          />
          <Button
            title="Add Location"
            onPress={() =>
              this.addMessage(
                createLocationMessage({ latitude: 14.618, longitude: 121.095 })
              )
            }
          />
        </View>

        {this.renderFullscreenImage()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', margin: 10 },

  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
