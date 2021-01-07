import React, { Component } from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, View, FlatList, TextInput, Dimensions} from 'react-native';
import {  ListItem, Text, Card, Button } from 'react-native-elements';
import firebase from '../Firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import moment from "moment"


class EditTaskScreen extends Component {
    static navigationOptions = {
        title: 'Edit Task',
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.ref = firebase.firestore().collection('timers').doc(JSON.parse(navigation.getParam('timerkey'))).collection('tasks');

        this.state = {
            isLoading: true,
            tasks: {},
            key: ''
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const tasks = [];
        const { navigation } = this.props;
        querySnapshot.forEach((doc) => {
            const { taskName, timeSeconds, sequenceNumber, image } = doc.data();
            console.log("Tasks data")
            console.log(doc.id);
            console.log(JSON.parse(navigation.getParam('taskkey')));
            if (JSON.parse(navigation.getParam('taskkey')) == doc.id) {
                console.log("Identified task");
                const task = doc.data();
                this.setState({
                    key: JSON.parse(navigation.getParam('timerkey')),
                    taskKey: doc.id,
                    taskName: task.taskName,
                    timeSeconds: task.timeSeconds,
                    sequenceNumber: task.sequenceNumber,
                    image: task.image,
                });
            }
            tasks.push({
                key: doc.id,
                doc, // DocumentSnapshot
                taskName,
                timeSeconds,
                sequenceNumber,
                image
            });
        });
        console.log("Setting state");
        console.log(this.state);
        this.setState({
            tasks : tasks,
            isLoading: false,
        });
        console.log("After setting the state");
        console.log(tasks.length);
        console.log(tasks[0]);


    }

    componentDidMount() {

        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }


    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
        console.log("setting field",text,field);
    }

    updateTimerTask() {

        this.setState({
            isLoading: true,
        });
        const { navigation } = this.props;
        console.log("updating field ",this.state.taskName);
        const updateRef = firebase.firestore().collection('timers').doc(this.state.key).collection('tasks').doc(JSON.parse(navigation.getParam('taskkey')));
        updateRef.set({
            taskName: this.state.taskName,
            timeSeconds: this.state.timeSeconds,
            sequenceNumber: this.state.sequenceNumber
        }).then((docRef) => {
            console.log("null ref");
            this.setState({
                key: '',
                taskName: '',
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

    deleteTask(key) {
        const { navigation } = this.props;
        this.setState({
            isLoading: true
        });
        const updateRef = firebase.firestore().collection('timers').doc(this.state.key).collection('tasks').doc(JSON.parse(navigation.getParam('taskkey')));
        updateRef.delete().then(() => {
            this.setState({
                isLoading: false
            });
            navigation.navigate('TimerDetails');
        }).catch((error) => {
            console.error("Error removing document: ", error);
            this.setState({
                isLoading: false
            });
        });
    }




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
                    <TextInput textAlign={'center'}
                        placeholder={"Sequence"}
                        value={this.state.sequenceNumber}
                        onChangeText={(text) => this.updateTextInput(text, 'sequenceNumber')}
                        keyboardType={'numeric'}
                    />
                </View>

                <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>

                <View style={styles.subContainer}>
                    <TextInput textAlign={'center'}
                        placeholder={'Task'}
                        value={this.state.taskName}
                        onChangeText={(text) => this.updateTextInput(text, 'taskName')}
                    />
                </View>

                <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>

                <View style={styles.subContainer}>
                    <TextInput textAlign={'center'}
                        placeholder={'Time'}
                        value={this.state.timeSeconds}
                        onChangeText={(text) => this.updateTextInput(text, 'timeSeconds')}
                    />
                </View>

                <Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>

                <View style = {styles.containerTest}>
                <View style={styles.buttonContainer}>
                    <Button style={styles.button}
                        large
                        leftIcon={{name: 'update'}}
                        title='Update'
                        onPress={() => this.updateTimerTask()} />
                </View>

                <View style={styles.buttonContainer}>
                    <Button style = {styles.button}
                            large
                            leftIcon={{name: 'delete'}}
                            title='Delete Task'
                            onPress={() => this.deleteTask(this.state.key)} />
                </View>

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
        flex:1,
        margin: 5,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 20 ,
        textAlignVertical: 'auto',
        alignItems: 'center'
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
    detailButton: {
        marginTop: 20,
        alignItems: 'center'
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
        marginLeft: 5,
        textAlign: 'justify',
        alignItems: 'center',
    },
    button: {
        width: Dimensions.get('window').width * .40,

    },
})

export default EditTaskScreen;