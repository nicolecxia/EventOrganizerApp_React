import { View, Text, Switch, Pressable, Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from "./styles";
import * as database from './../../../../src/database';
import { useState } from "react";
import { primaryColor } from "../../../includs/variables";

export default function TodoItem({ id, userid, title,liked, description, published, onStatusChange, onPostDelete, showEdit }) {
    const currentUserId = database.userUID;

    // const liked = true;
    const [likeStatus, setLikeStatus] = useState(liked);
    const likeName = likeStatus ? 'like1' : 'like2';

    const handleLabelPress = () => {
        onStatusChange("published",!published, id);
    }

    const handleLikeChange = async () => {
        console.log('liked pressed');

        onStatusChange("liked",!liked, id);
        setLikeStatus(!liked)

            // const data = {
            //     liked: !liked,
            //     id: id
            // }
            // console.log('liked:', data);
    
            // //can only send on parameter to payload, if have multiple data, including all of them in an object
            // // dispatch(changeLiked(data));
            // setLikeStatus(!liked);
    
            // //...then update the data on the database
            // const updated = await database.update(id, { liked: !liked });
    
    
            // if (!updated) {
            //     const data = {
            //         liked: !liked,
            //         id: id
            //     }
            //     //can only send on parameter to payload, if have multiple data, including all of them in an object
            //     // dispatch(changeLiked(data));
            //     setLikeStatus(!liked);
    
            //     Alert.alert('Error', 'There was an error trying to update the post!', [{ text: 'OK' }]);
            // }
    
    }

    const handleDeletePress = () => {
        Alert.alert(
            'Delete Post',
            `This message will delete the post ${title}. \nAre you sure?`,
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        onPostDelete(id);
                    }
                },
                {
                    text: 'No',
                }
            ]
        );
    }

    return (
        <>
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <Text style={styles.description}>
                        {description}
                    </Text>
                </View>

                <View style={styles.buttons}>
                    <AntDesign.Button
                        name={likeName}
                        size={24}
                        color={primaryColor}
                        backgroundColor="transparent"
                        underlayColor="#ffdddd"
                        onPress={handleLikeChange}
                      
                    >
                        Like
                    </AntDesign.Button>

                    {currentUserId == userid && !showEdit && (
                        <>
                            <Text style={{color:'green'}}>My Post</Text>
                        </>
                    )}

                    {currentUserId == userid && showEdit && (<>
                        <View style={styles.switch}>
                            <Switch
                                value={published}
                                onValueChange={(value) => onStatusChange("published",value, id)}
                            />
                            {/* <Pressable onPress={handleLabelPress}> */}
                            <Text style={styles.switchText}>Publish</Text>
                            {/* </Pressable> */}
                        </View>
                        <AntDesign.Button
                            name="delete"
                            size={24}
                            color="#cc0000"
                            backgroundColor="transparent"
                            underlayColor="#ffdddd"
                            onPress={handleDeletePress}
                        >
                            Delete
                        </AntDesign.Button>
                    </>

                    )
                    }

                </View>
            </View>


        </>
    );
}