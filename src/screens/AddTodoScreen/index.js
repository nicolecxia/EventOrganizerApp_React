import { Button, StyleSheet, Text, View } from 'react-native';
import { StackActions } from '@react-navigation/native';
import Form from '../../components/Form';
import MineLayout from '../../components/MineLayout';
import TodoList from '../../components/TodoList';
import SignUp from '../../components/SignUp';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AddTodoScreen({ navigation, route, posts, onStatusChange, onPostDelete, onReloadPosts,onAddPost }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Mine" options={{ headerShown: false }} >
            {(props) => (
                    <MineLayout {...props} onReloadPosts={onReloadPosts} />
                )}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
            <Stack.Screen name="MyPosts" options={{ title: 'My posts' }} >
                {(props) => (
                      <TodoList
                      handleAddPostPress={onAddPost}
                      posts={posts}
                      onStatusChange={onStatusChange}
                      onPostDelete={onPostDelete}
                      showEdit = {true}
                  />
                )}
            </Stack.Screen>
            <Stack.Screen name="MyLikes" options={{ title: 'My likes' }} >
                {(props) => (
                      <TodoList
                      handleAddPostPress={onAddPost}
                      posts={posts}
                      onStatusChange={onStatusChange}
                      onPostDelete={onPostDelete}
                      showEdit = {false}
                  />
                )}
            </Stack.Screen>

            {/* <Stack.Screen name='Add' options={{ headerShown: true }}>
                {(props) => (
                    <Form {...props} onAddPost={onAddPost} />
                )}
            </Stack.Screen> */}
        </Stack.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});