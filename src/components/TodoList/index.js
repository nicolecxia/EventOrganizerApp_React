import { Pressable, ScrollView, Text, View, Modal, TextInput, Button } from "react-native";
import TodoItem from "./TodoItem";
import styles from "./styles";
import { useState } from "react";
import * as database from './../../database';

export default function TodoList({ handleAddPostPress, posts, onStatusChange, onPostDelete, showEdit }) {
    const [showModal, setShowModal] = useState(false);

    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [publish, setPublish] = useState('');

    const handlePostPress = (post) => {
        if (post.userid == database.userUID) {
            setId(post.id)
            setTitle(post.title);
            setDescription(post.description);
            setPublish(post.publish);

            setShowModal(true);
        }
    }

    const handleModalToggle = () => {
        setShowModal(!showModal);
    }

    const handleSaveModalToggle = () => {
        onStatusChange("title",title, id);
        onStatusChange("description",description, id);

        setShowModal(!showModal);
    }

    return (
        <>
            <ScrollView>
                {posts.map((post, index) => {
                    return (//must return JSX
                        <Pressable key={index} onPress={() => handlePostPress(post)}>
                            <TodoItem
                                {...post}
                                onStatusChange={onStatusChange}
                                onPostDelete={onPostDelete}
                                showEdit={showEdit}
                            />
                        </Pressable>
                    )
                })}
                <View style={{ height: 90 }}></View>
            </ScrollView>
            <View style={styles.addButtonContainer}>
                <Pressable onPress={handleAddPostPress}>
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>

            <Modal visible={showModal} animationType="none" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTextTitle}>Modify Event</Text>
                        <Text style={styles.modalText}>Title</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <Text style={styles.modalText}>Description</Text>

                        <TextInput
                            style={[styles.textInput, styles.textInputDescription]}
                            placeholder="Description"
                            multiline={true}
                            value={description}
                            onChangeText={setDescription}
                        />
                          <Text />
                        <Button title="Save" onPress={handleSaveModalToggle}></Button>
                        <Text />
                        <Button title="Close" onPress={handleModalToggle}></Button>
                    </View>
                </View>
            </Modal>
        </>
    );
}