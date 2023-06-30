import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
    const [inputText, setInputText] = useState('');
    const [projectName, setProjectName] = useState('');

    const handleUploadUser = () => {
        // Make an HTTP request to upload the user data to the server
        axios.post('http://10.0.2.2:3000/api/users/create', { name: inputText })
            .then(response => {
                console.log('User added successfully');
            })
            .catch(error => {
                console.error('Error adding user:', error);
            });
    };

    const handleUploadProject = () => {
        // Make an HTTP request to upload the project data to the server
        axios.post('http://10.0.2.2:3000/api/projects/create', { project: projectName })
            .then(response => {
                console.log('Project added successfully');
            })
            .catch(error => {
                console.error('Error adding project:', error);
            });
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Home Screen</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setProjectName(text)}
                    value={projectName}
                    placeholder="Enter project name"
                />
                <Button onPress={handleUploadProject} title="Add Project" />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <TextInput
                    style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setInputText(text)}
                    value={inputText}
                    placeholder="Enter username"
                />
                <Button onPress={handleUploadUser} title="Add User" />
            </View>
        </View>
    );
}
