import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile({ toggleTheme }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('profileDraft').then(data => {
      if (data) {
        const draft = JSON.parse(data);
        setName(draft.name || '');
        setBio(draft.bio || '');
        setImages(draft.images || []);
      }
    });
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  const handleSave = async () => {
    const uploadedURLs = [];
    for (let uri of images) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const imgRef = ref(storage, \`profiles/\${auth.currentUser.uid}/\${filename}\`);
      await uploadBytes(imgRef, blob);
      const url = await getDownloadURL(imgRef);
      uploadedURLs.push(url);
    }

    const profileData = { name, bio, imageURLs: uploadedURLs };
    await setDoc(doc(db, 'users', auth.currentUser.uid), profileData);
    await AsyncStorage.setItem('profileDraft', JSON.stringify(profileData));
    alert('Profile saved and synced!');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Bio" value={bio} onChangeText={setBio} />
      <Button onPress={pickImages}>Pick Multiple Images</Button>
      <ScrollView horizontal>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={{ width: 100, height: 100, marginRight: 10 }} />
        ))}
      </ScrollView>
      <Button mode="contained" onPress={handleSave}>Save Profile</Button>
      <Button onPress={toggleTheme}>Toggle Theme</Button>
    </ScrollView>
  );
}
