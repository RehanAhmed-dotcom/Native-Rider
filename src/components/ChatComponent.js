
import database from '@react-native-firebase/database';

export const senderMsg = async (msgValue, currentUserId, guestUserId, date, imageUrl = null) => {
    console.log(
        'inside sender function',
        msgValue,
        currentUserId,
        guestUserId,
        date,
        imageUrl
    );
    try {
        return await database()
            .ref('messeges/' + currentUserId)
            .child(guestUserId)
            .push({
                messege: {
                    sender: currentUserId,
                    reciever: guestUserId,
                    msg: msgValue,
                    date,
                    image: imageUrl,
                },
            });
    } catch (error) {
        console.log('error in send message', error);
        return error;
    }
};

export const recieverMsg = async (msgValue, currentUserId, guestUserId, date, imageUrl = null) => {
    console.log(
        'inside receiver function',
        msgValue,
        currentUserId,
        guestUserId,
        date,
        imageUrl
    );
    try {
        return await database()
            .ref('messeges/' + guestUserId)
            .child(currentUserId)
            .push({
                messege: {
                    sender: currentUserId,
                    reciever: guestUserId,
                    msg: msgValue,
                    date,
                    image: imageUrl,
                },
            });
    } catch (error) {
        console.log('error in reciving message ', error);
        return error;
    }
};
export const senderVoice = async (
    msgValue,
    currentUserId,
    guestUserId,
    date,
    // quote,
) => {
    try {
        return await database()
            .ref('messeges/' + currentUserId)
            .child(guestUserId)
            .push({
                messege: {
                    sender: currentUserId,
                    reciever: guestUserId,
                    audio: msgValue,
                    date,

                    // quote,
                },
            });
    } catch (error) {
        console.log('error in reciving message ', error);
        return error;
    }
};
export const recieverVoice = async (
    msgValue,
    currentUserId,
    guestUserId,
    date,

    // quote,
) => {
    try {
        return await database()
            .ref('messeges/' + guestUserId)
            .child(currentUserId)
            .push({
                messege: {
                    sender: currentUserId,
                    reciever: guestUserId,
                    audio: msgValue,
                    date,

                    // quote,
                },
            });
    } catch (error) {
        console.log('error in reciving message ', error);
        return error;
    }
};
