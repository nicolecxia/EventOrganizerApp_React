import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import AddTodoScreen from './src/screens/AddTodoScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from 'react';
import uuid from 'react-uuid';
import * as database from './src/database';

//Create the Tab controller
const Tab = createBottomTabNavigator();

export default function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // IIFE - Immediately Invoked Function Expression
    (async () => {
      let data = await database.loadPublished();
      setPosts(data);
    })();
  }, [])

  const handelReloadPosts = (data) => {
    setPosts(data);
  }

  const handleStatusChange = async (column, value, id) => {
    console.log('New status:', value, id);
    let tempData = {};

    const updatePosts = await posts.map((post) => {
      if (post.id === id) {
        if (column === "published") {
          post.published = value;
          tempData = { published: value };
        } else if (column === "title") {
          post.title = value;
          tempData = { title: value };
        } else if (column === "description") {
          post.description = value;
          tempData = { description: value };
        } else if (column === "liked") {
          post.liked = value;
          tempData = { liked: value };
        }

      }
      return post;
    });


    await database.update(id, tempData);

    setPosts(updatePosts);

  }

  const handlePostDelete = (id) => {
    database.remove(id).then((deleted) => {
      if (deleted) {
        const filterPosts = posts.filter((post) => post.id != id);
        setPosts(filterPosts);
      }
    })

  }

  const handleAddPost = (title, description, published) => {
    const newPost = {
      userid: database.userUID,
      title,  //same with title: title, 
      description: description,
      published: published,
      liked:false
    }

    const updatedPosts = [...posts, newPost];

    //setPosts() will check updatedPosts and posts 是否有区别，有区别才会触发页面刷新
    //因此不能直接posts.push(newPost)后，再将其posts传给setPosts(posts)，这样setPosts比较的是同个Object
    setPosts(updatedPosts);

    database.save(newPost);
  }


  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarActiveBackgroundColor: 'dodgerblue',
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Mine') {
              iconName = focused ? 'list' : 'list-ul'
            } else if (route.name === 'Home') {
              iconName = focused ? 'plus' : 'plus-circle'
            }
            return <Icon name={iconName} size={24} color={color} />
          }
        })}
      >
        <Tab.Screen name='Home'>
          {(props) => (
            <HomeScreen
              {...props}
              posts={posts}
              onStatusChange={handleStatusChange}
              onPostDelete={handlePostDelete}
              onAddPost={handleAddPost}
              onReloadPosts={handelReloadPosts}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name='Mine' >
          {(props) => (
            <AddTodoScreen {...props}
              posts={posts}
              onStatusChange={handleStatusChange}
              onPostDelete={handlePostDelete}
              onAddPost={handleAddPost}
              onReloadPosts={handelReloadPosts} />
          )}

        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
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
