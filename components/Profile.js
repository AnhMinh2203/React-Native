import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { addComment, editComment, deleteComment, setComments } from '../redux/reducers/reducer';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [modalType, setModalType] = useState('');
  const [form, setForm] = useState({ name: '', body: '' });

  const comments = useSelector((state) => state.comments.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
        const firstTenComments = response.data.slice(0, 10);
        dispatch(setComments(firstTenComments));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };
    fetchComments();
  }, [dispatch]);

  const handleAddComment = async () => {
    if (!form.name || !form.body) {
      Alert.alert('Validation Error', 'Name and Body are required.');
      return;
    }

    const newId = comments.length > 0 ? comments[comments.length - 1].id + 1 : 1;
    const newComment = { id: newId, name: form.name, body: form.body };

    try {
      await axios.post('https://jsonplaceholder.typicode.com/comments', newComment);
      dispatch(addComment(newComment));
      setModalVisible(false);
      setForm({ name: '', body: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleEditComment = async () => {
    if (!form.name || !form.body) {
      Alert.alert('Validation Error', 'Name and Body are required.');
      return;
    }

    const updatedComment = { ...currentComment, name: form.name, body: form.body };
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/comments/${currentComment.id}`, updatedComment);
      dispatch(editComment(updatedComment));
      setModalVisible(false);
      setForm({ name: '', body: '' });
    } catch (error) {
      console.error('Error editing comment:', error);
      Alert.alert('Error', 'Failed to edit comment');
    }
  };

  const handleDeleteComment = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this comment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(`https://jsonplaceholder.typicode.com/comments/${id}`);
              dispatch(deleteComment(id));
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentCard}>
      <Text style={styles.commentId}>ID: {item.id}</Text>
      <Text style={styles.commentText}><Text style={styles.bold}>Name:</Text> {item.name}</Text>
      <Text style={styles.commentText}><Text style={styles.bold}>Body:</Text> {item.body}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setCurrentComment(item);
            setModalType('edit');
            setForm({ name: item.name, body: item.body });
            setModalVisible(true);
          }}
        >
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteComment(item.id)}
        >
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4081" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Learning Levels</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderComment}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalType('add');
          setForm({ name: '', body: '' });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add Comment</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalType === 'add' ? 'Add Level' : 'Edit Level'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={form.body}
              onChangeText={(text) => setForm({ ...form, body: text })}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={modalType === 'add' ? handleAddComment : handleEditComment}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#828282',
  },
  listContainer: {
    padding: 16,
  },
  commentCard: {
    backgroundColor: '#E8E8E8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  commentId: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 16,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#f9f9f9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#828282',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#778899',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#757575',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
