import { Button, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import TodoList from '../../components/TodoList';
import MineLayout from '../../components/MineLayout';
import * as database from './../../database';
import { useCallback, useState } from 'react';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation, route, posts, onStatusChange, onPostDelete, onAddPost, onReloadPosts }) {
    const [userUID, setUserUID] = useState(database.userUID);
    const [email, setEmail] = useState(database.userEmail);
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);


    useFocusEffect(
        useCallback(() => {
            setUserUID(database.userUID);

            async function reloadPosts() {
                let data = await database.loadPublished();
                // dispatch(setPosts(data));
                onReloadPosts(data);
            }

            reloadPosts();
        })
    )

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
            {userUID && (
                <TodoList
                    handleAddPostPress={handleAddPostPress}
                    posts={posts}
                    onStatusChange={onStatusChange}
                    onPostDelete={onPostDelete}
                    showEdit = {false}
                />
            )}
        </>
    )
}