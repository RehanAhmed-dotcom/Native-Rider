import database from '@react-native-firebase/database';

export const senderMsgSupport = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
  childKey
) => {
  try {
    return await database()
      .ref('messegesSupport/' + currentUserId)
      .child(guestUserId)
      .child(childKey)
      .set({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
          _id: childKey,
        },
      });
  } catch (error) {
    console.log('error in sending message', error);
    return error;
  }
};

export const recieverMsgSupport = async (
  msgValue,
  currentUserId,
  guestUserId,
  date,
  childKey
) => {
  try {
    return await database()
      .ref('messegesSupport/' + guestUserId)
      .child(currentUserId)
      .child(childKey)
      .set({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          date,
          _id: childKey,
        },
      });
  } catch (error) {
    console.log('error in receiving message', error);
    return error;
  }
};