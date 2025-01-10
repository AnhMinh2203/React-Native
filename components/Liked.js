import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Import từ react-redux
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios'; // Import axios
import { addComment, editComment, deleteComment, setComments } from '../redux/reducers/reducer'; // Add setComments action

const Liked = () => {
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [modalType, setModalType] = useState(''); // "add" | "edit"
  const [form, setForm] = useState({ name: '', body: '' });

  const comments = useSelector((state) => state.comments.comments); // Lấy comments từ Redux store
  const dispatch = useDispatch(); // Dispatch actions

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
        const firstTenComments = response.data.slice(0, 10);  // Lấy 10 dòng đầu tiên
        dispatch(setComments(firstTenComments)); // Dispatch API data to Redux store
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };
    fetchComments();
  }, [dispatch]);

  // Hàm thêm bình luận mới
  const handleAddComment = async () => {
    if (!form.name || !form.body) {
      Alert.alert('Validation Error', 'Both Name and Body are required.');
      return;
    }

    // Lấy id tiếp theo từ Redux store (hoặc state)
    const nextId = comments.length > 0 ? Math.max(...comments.map((comment) => comment.id)) + 1 : 11;
    
    const newComment = { ...form, id: nextId }; // Dùng id tiếp theo

    try {
      // Thêm bình luận vào API (giả lập thêm vào API)
      await axios.post('https://jsonplaceholder.typicode.com/comments', newComment);
      dispatch(addComment(newComment)); // Gửi action addComment vào Redux
      setModalVisible(false);
      setForm({ name: '', body: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleEditComment = async () => {
    if (!form.name || !form.body) {
      Alert.alert('Validation Error', 'Both Name and Body are required.');
      return;
    }
    const updatedComment = { ...currentComment, name: form.name, body: form.body };
    try {
      // Chỉnh sửa comment (Giả lập chỉnh sửa trên API)
      await axios.put(`https://jsonplaceholder.typicode.com/comments/${currentComment.id}`, updatedComment);
      dispatch(editComment(updatedComment)); // Gửi action editComment vào Redux
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
              // Xóa comment (Giả lập xóa trên API)
              await axios.delete(`https://jsonplaceholder.typicode.com/comments/${id}`);
              dispatch(deleteComment(id)); // Gửi action deleteComment vào Redux
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
    <View style={styles.comment}>
      <Text style={styles.text}>
        <Text style={styles.bold}>ID:</Text> {item.id}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Name:</Text> {item.name}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Body:</Text> {item.body}
      </Text>
      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setCurrentComment(item);
            setModalType('edit');
            setForm({ name: item.name, body: item.body });
            setModalVisible(true);
          }}
        >
          <Icon name="edit" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteComment(item.id)}
        >
          <Icon name="delete" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ); // Hiển thị loading spinner khi đang tải dữ liệu
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.showButton}
        onPress={() => setShowComments(!showComments)}
      >
        <Text style={styles.buttonText}>{showComments ? 'Hide Comments' : 'Show Comments'}</Text>
      </TouchableOpacity>

      {/* Nút thêm bình luận */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalType('add');
          setForm({ name: '', body: '' });
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Add Comment</Text>
      </TouchableOpacity>

      {showComments ? (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
        />
      ) : (
        <Text>No comments available</Text>
      )}

      {/* Modal để thêm và chỉnh sửa bình luận */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'add' ? 'Add Comment' : 'Edit Comment'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Body"
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
              style={styles.saveButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 5,
    borderRadius: 5,
  },
  showButton: {
    backgroundColor: "#008CBA",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Liked;
