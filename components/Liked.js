import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList} from "react-native";

const Liked = () => {
    const [comment, setComment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFirstComment();
    }, []);

    const fetchFirstComment = async () => {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/comments");
            const data = await response.json();
            setComment(data.slice(0, 2)); // Lấy 2 phần tử đầu tiên
        } catch (error) {
            console.error("Error fetching comment:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.comment}>
            <Text style={styles.text}><Text style={styles.bold}>Post ID:</Text> {item.postId}</Text>
            <Text style={styles.text}><Text style={styles.bold}>ID:</Text> {item.id}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Name:</Text> {item.name}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Email:</Text> {item.email}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Body:</Text> {item.body}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loading}>Loading...</Text>
            ) : (
                <FlatList
                    data={comment}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderComment}
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    comment: {
        backgroundColor: "#fff",
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 3,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
    },
    bold: {
        fontWeight: "bold",
    },
    loading: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
    },
    error: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default Liked;
