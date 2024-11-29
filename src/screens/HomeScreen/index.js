import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeLayout from '../../components/HomeLayout';
import SignUp from '../../components/SignUp';
import Form from '../../components/Form';

const Stack = createNativeStackNavigator();

export default function HomeScreen({ navigation, route, posts, onStatusChange, onPostDelete, onAddPost,onReloadPosts }) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" options={{ headerShown: false }} >
                {(props) => (
                    <HomeLayout {...props} posts={posts} onStatusChange={onStatusChange} onPostDelete={onPostDelete} onAddPost={onAddPost} onReloadPosts={onReloadPosts} />
                )}
            </Stack.Screen>
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
            <Stack.Screen name='Add' options={{ headerShown: true }}>
                {(props) => (
                    <Form {...props} onAddPost={onAddPost} />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
