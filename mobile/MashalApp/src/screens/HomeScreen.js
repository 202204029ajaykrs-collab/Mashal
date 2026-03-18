import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import axios from 'axios';
import Video from 'react-native-video';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const HomeScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchVideos().then(() => setRefreshing(false));
  }, []);

  const handleLike = async (videoId) => {
    try {
      await axios.post(`${API_URL}/api/videos/${videoId}/like`);
      // Refresh the feed so counts and like state are up to date
      await fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = ({ item }) => {
    const likeCount = item.likeCount ?? item.likes?.length ?? 0;
    const liked = user ? item.likes?.includes(user._id) : false;

    return (
      <Card style={styles.card}>
        <TouchableOpacity>
          <Video
            source={{ uri: item.url }}
            style={styles.video}
            controls={true}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Card.Content>
          <Title>{item.title}</Title>
          {item.user && <Paragraph>by {item.user.name}</Paragraph>}
          <Paragraph>{item.caption}</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <IconButton
            icon={liked ? 'heart' : 'heart-outline'}
            color={liked ? '#e91e63' : undefined}
            onPress={() => handleLike(item._id)}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button onPress={logout} style={styles.logoutButton}>
          Logout
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Upload')}
          style={styles.button}
        >
          Upload Video
        </Button>
      </View>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    margin: 10,
  },
  video: {
    width: '100%',
    height: 200,
  },
  button: {
    marginTop: 12,
  },
  logoutButton: {
    marginTop: 12,
  },
  actions: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default HomeScreen;

