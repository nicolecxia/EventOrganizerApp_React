import { Text, Pressable, View, TextInput } from "react-native";
import styles from "./styles";
import * as database from './../../database';
// import { useDispatch } from "react-redux";
// import { setPosts } from "../../redux/postsSlice";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";


export default function HomeLayout({ navigation, route, onReloadPosts }) {
    const [userUID, setUserUID] = useState(database.userUID);
    const [email, setEmail] = useState(database.userEmail);
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            setUserUID(database.userUID);
            setEmail(database.userEmail);
            // async function reloadPosts() {
            //     let data = await database.loadByConditions('userid', userUID);
            //     // dispatch(setPosts(data));
            //     onReloadPosts(data);
            // }

            // reloadPosts();
        })
    )

    // const handleLikesPostPress = async () => {
    //     let data = await database.loadByConditions('liked', true);
    //     dispatch(setPosts(data));

    //     navigation.navigate('MyLikes');
    // }

    const handleMyPostPress = async () => {
        let data = await database.loadByConditions('userid', userUID);
        onReloadPosts(data);

        navigation.navigate('MyPosts');
    }

    const handleLikesPostPress = async () => {
        let data = await database.loadByConditions('liked', true);
        onReloadPosts(data);

        // let data = await database.load();
        // let like = await database.loadLiked(userUID);

        //   async function getLike() {
        //        const likeData = data.filter((data1)=>like.some((like1)=>data1.id === like1.docid));
        //         onReloadPosts(likeData);

        //         console.log(likeData);
        //     } 
        // getLike();

        navigation.navigate('MyLikes');
    }

    const handleAddPostPress = async () => {
        navigation.navigate('Add');
    }

    const handleSignUpPress = async () => {
        navigation.navigate('SignUp');
    }

    const handleSigninPress = async () => {
        const validate = [];
        if (email === '') {
            validate.push('The email is required.');
        }

        if (password === '') {
            validate.push('The password is required.');
        }
        if (validate.length > 0) {
            setErrorMessages(validate);
        } else {
            setErrorMessages([]);
            // "123@qq.com", "123456"
            await database.userSignIn(email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    setUserUID(database.userUID);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    validate.push('Login in error:', errorMessage);
                    setErrorMessages(validate);
                });
        }
    }

    const handleSignOutPress = async () => {
        const validate = [];
        await database.userSignOut().then(() => {
            // Sign-out successful.
            setUserUID(database.userUID);
            setErrorMessages([]);
        }).catch((error) => {
            // An error happened.
            validate.push('Signout error:', error.message);
            setErrorMessages(validate);
        });
    }


    return (
        <>
            {/*conditionally display the error message */}
            {errorMessages.length > 0 && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorMessageTitle}>Invalid data:</Text>
                    {errorMessages.map((errMsg, index) => (
                        <Text key={index} style={styles.errorMessageItem}>
                            - {errMsg}
                        </Text>
                    ))}
                </View>
            )}
            {!userUID && (<>
                <View style={styles.itemsContainer}>
                    <Text style={[styles.label, styles.itemsLabel]}>Email:</Text>
                    <View style={styles.itemsInput}>
                        <TextInput style={styles.textInput}
                            value={email}
                            onChangeText={setEmail}>
                        </TextInput>
                    </View>
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={[styles.label, styles.itemsLabel]}>Password:</Text>
                    <View style={styles.itemsInput}>
                        <TextInput secureTextEntry={true} style={styles.textInput}
                            value={password}
                            onChangeText={setPassword}>
                        </TextInput>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.button}>
                        <Pressable onPress={handleSigninPress}>
                            <Text style={styles.buttonText}>Sign In</Text>
                        </Pressable>
                    </View>
                    <View style={styles.button}>
                        <Pressable onPress={handleSignUpPress}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
                <Text></Text></>)
            }
            {userUID && (<><View style={styles.container}>
                <Text style={styles.account}>Account: {email}</Text>
                <View style={styles.button}>
                    <Pressable onPress={handleLikesPostPress}>
                        <Text style={styles.buttonText}>My Likes</Text>
                    </Pressable>
                </View>
                <View style={styles.button}>
                    <Pressable onPress={handleMyPostPress}>
                        <Text style={styles.buttonText}>My Posts</Text>
                    </Pressable>
                </View>
                <View style={styles.button}>
                    <Pressable onPress={handleSignOutPress}>
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </Pressable>
                </View>
            </View>
                {/* <View style={styles.addButtonContainer}>
                    <Pressable onPress={handleAddPostPress}>
                        <Text style={styles.addButtonText}>+</Text>
                    </Pressable>
                </View> */}
                </>)
            }
        </>
    )

}