import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    View,
    TextInput,
    StatusBar,
    Text,
    Image,
    Dimensions
} from 'react-native';
import {Button, ButtonGroup} from 'react-native-elements';
import firebase from '../Firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class AddTaskScreen extends Component {
    static navigationOptions = {
        title: 'Add Task',
    };
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.ref = firebase.firestore().collection('timers').doc(JSON.parse(navigation.getParam('timerkey'))).collection('tasks');

        this.state = {
            taskName: '',
            timeSeconds: 0,
            taskImage: '',
            sequenceNumber: 0,
            isLoading: false,
        };
    }
    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    saveTask() {
        this.setState({
            isLoading: true,
        });
        this.ref.add({
            taskName: this.state.taskName,
            timeSeconds: this.state.timeSeconds,
            sequenceNumber: Number(this.state.sequenceNumber),
            taskImage: this.state.taskImage,
        }).then((docRef) => {
            this.setState({
                taskName: '',
                timeSeconds: 0,
                sequenceNumber: 0,
                isLoading: false,
            });
            this.props.navigation.goBack();
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
                this.setState({
                    isLoading: false,
                });
            });
    }

    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}>
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };

    _maybeRenderImage = () => {
        let { taskImage } = this.state;
        console.log("uploaded ",this.state.taskImage);
        if (!taskImage) {
            return;
        }

        return (
            <View
                style={{
                    marginTop: 30,
                    width: 250,
                    borderRadius: 3,
                    elevation: 2,
                }}>
                <View
                    style={{
                        borderTopRightRadius: 3,
                        borderTopLeftRadius: 3,
                        shadowColor: 'rgba(0,0,0,1)',
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 4, height: 4 },
                        shadowRadius: 5,
                        overflow: 'hidden',
                    }}>
                    <Image source={{ uri: taskImage }} style={{ width: 250, height: 250 }} />
                </View>

            </View>
        );
    };

    _share = () => {
        Share.share({
            message: this.state.taskImage,
            title: 'Check out this photo',
            url: this.state.taskImage,
        });
    };

    _copyToClipboard = () => {
        Clipboard.setString(this.state.taskImage);
        alert('Copied image URL to clipboard');
    };

    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };


    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                this.setState({ taskImage: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };


    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Sequence Number'}
                        value={this.state.sequenceNumber}
                        keyboardType={'numeric'}
                        onChange={(number) => this.updateTextInput(number, 'sequenceNumber')}
                    />
                </View>

                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Task Name'}
                        value={this.state.taskName}
                        onChangeText={(text) => this.updateTextInput(text, 'taskName')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        placeholder={'Time'}
                        value={this.state.timeSeconds}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTextInput(text, 'timeSeconds')}
                    />
                </View>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {this._maybeRenderImage()}
                    {this._maybeRenderUploadingOverlay()}
                </View>

                <View style={styles.containerTest}>
                <View style={styles.buttonContainer}>
                        <Button style = {styles.button}
                                onPress={this._pickImage}
                                title="Pick Image"
                        />
                </View>
                <View style={styles.buttonContainer}>
                    <Button style = {styles.button} onPress={this._takePhoto} title="Take a photo" />

                    <StatusBar barStyle="default" />
                </View>

                </View>
                <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>




                <View style={{alignItems: 'center'}}>
                    <Button style = {{width: Dimensions.get('window').width * .8}}
                        large
                        leftIcon={{name: 'add'}}
                        title='Add'
                        onPress={() => this.saveTask()} />
                    <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
                </View>

            </ScrollView>
        );
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    subContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerTest: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,

    },
    buttonContainer: {
        //justifyContent: 'space-evenly',
        marginLeft: 10,
        textAlign: 'justify',
        alignItems: 'center',
    },
    button: {
        width: Dimensions.get('window').width * .45,

    },

})

async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = firebase
        .storage()
        .ref()
        .child('taskimage1.jpg');
    console.log("in uploadimage ",ref);
    const snapshot = await ref.put(blob);


    // We're done with the blob, close and release it
    //blob.close();

    return await snapshot.ref.getDownloadURL();
}

export default AddTaskScreen;
