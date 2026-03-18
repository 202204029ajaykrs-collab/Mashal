import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config/api';

const UploadScreen = ({ navigation }) => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const { user } = useContext(AuthContext);

  const selectVideo = () => {
    launchImageLibrary({ mediaType: 'video' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setVideo(response.assets[0]);
      }
    });
  };

  const handleUpload = async () => {
    if (!video) {
      Alert.alert('Error', 'Please select a video to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', {
      uri: video.uri,
      type: video.type,
      name: video.fileName,
    });
    formData.append('title', title);
    formData.append('caption', caption);
    formData.append('tags', tags);

    try {
      const response = await axios.post(
        `${API_URL}/api/videos/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      Alert.alert('Success', 'Video uploaded successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error?.response?.data || error);
      Alert.alert('Error', 'Something went wrong while uploading the video.');
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={selectVideo}>Select Video</Button>
      {video && <TextInput label="Video" value={video.fileName} disabled />}
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Caption"
        value={caption}
        onChangeText={setCaption}
        style={styles.input}
      />
      <TextInput
        label="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleUpload} style={styles.button}>
        Upload
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
});

export default UploadScreen;
