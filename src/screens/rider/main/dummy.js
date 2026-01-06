import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors, fonts, images} from '../../../constant/Index';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
// import {OPEN_AI_KEY} from '@env';
import axios from 'axios';
const Chat = ({navigation}) => {
  const apiKey = Api_key;
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      text: 'Hey! How can i assist you today?',
    },
  ]);
  const isDarkMode = useSelector(state => state.theme.isDarkMode);

  const sendMessageToAI = async message => {
    setIsTyping(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{role: 'user', content: message}],
          max_tokens: 150,
          temperature: 0.0,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      const aiMessage = response.data.choices[0].message.content; // Extract AI's message
      console.log('API Response:', aiMessage);

      // Add bot's response to messages
      const newBotMessage = {
        id: `${Date.now()}-bot`, // Unique ID for bot message
        type: 'bot',
        text: aiMessage,
      };

      setMessages(prevMessages => [newBotMessage, ...prevMessages]); // Update state
      setIsTyping(false);
    } catch (error) {
      if (error.response) {
        console.log('API key might be invalid:', error.response.data);
        setIsTyping(false);
      } else {
        console.log('Error:', error.message);
        setIsTyping(false);
      }
    }
  };

  const handleSend = () => {
    if (inputMessage.trim() === '') return;

    // Add user message to messages
    const newUserMessage = {
      id: `${Date.now()}`, // Uses the current timestamp as a unique identifier.
      type: 'user',
      text: inputMessage,
    };

    setMessages(prevMessages => [newUserMessage, ...prevMessages]);
    sendMessageToAI(inputMessage); // Send the message to the AI
    setInputMessage(''); // Clear input
  };

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.botMessage,
      ]}>
      {item.type === 'bot' && (
        <Image
          source={images.chatImg}
          resizeMode="contain"
          style={styles.botImage}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: item.type === 'bot' ? '#fff' : '#CCD6F5',
          },
        ]}>
        <Text
          style={[
            styles.messageText,
            {color: isDarkMode ? '#D9D9D9' : '#495057'},
          ]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#0D0F13' : '#F4F4F4'},
      ]}>
      {/ Header /}
      <View
        style={[
          styles.header,
          {backgroundColor: isDarkMode ? '#191D24' : 'white'},
        ]}>
        <Text
          style={[styles.headerTitle, {color: isDarkMode ? 'white' : 'black'}]}>
          Chat AI Bot
        </Text>
        <TouchableOpacity>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={isDarkMode ? 'white' : 'black'}
          />
        </TouchableOpacity>
      </View>

      {/ Chat Messages /}
      <FlatList
        data={messages}
        inverted
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
      />

      {/ Typing Indicator /}
      {isTyping && (
        <Text style={styles.typingIndicator}>AI Assistant is typing...</Text>
      )}

      {/ Input Section /}
      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputWrapper,
            {backgroundColor: isDarkMode ? '#191D24' : 'white'},
          ]}>
          <TextInput
            placeholder="Ask anything"
            placeholderTextColor="lightgrey"
            value={inputMessage}
            onChangeText={text => setInputMessage(text)}
            style={[
              styles.input,
              {
                backgroundColor: isDarkMode ? '#191D24' : 'white',
                color: isDarkMode ? 'white' : 'black',
              },
            ]}
          />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <FontAwesome name="send" color="#232323" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: wp(100),
    height: wp(20),
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  chatList: {
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginTop: wp(3),
    marginBottom: wp(1),
  },
  userMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  botImage: {
    width: wp(8),
    height: wp(8),
    marginRight: wp(2),
  },
  messageBubble: {
    maxWidth: wp(75),
    paddingVertical: wp(3),
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  messageText: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  typingIndicator: {
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
    marginBottom: wp(2),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: wp(2),
    alignItems: 'center',
    marginTop: wp(5),
    marginBottom: wp(3),
  },
  inputWrapper: {
    width: wp(75),
    height: wp(13),
    borderRadius: wp(2),
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    paddingLeft: wp(3),
    borderRadius: wp(2),
  },
  sendButton: {
    width: wp(13),
    height: wp(13),
    backgroundColor: colors.button,
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
