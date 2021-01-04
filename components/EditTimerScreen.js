import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../Firebase';

class EditTimerScreen extends Component {
    static navigationOptions = {
        title: 'Edit Timer',
    };
    constructor() {
        super();
        this.state = {
            key: '',
            name: '',
            task: '',
            time: 0,
            isLoading: false,
        };
    }
    componentDidMount() {
        const { navigation } = this.props;
        const ref = firebase.firestore().collection('timers').doc(JSON.parse(navigation.getParam('timerkey')));
        ref.get().then((doc) => {
            if (doc.exists) {
                const timer = doc.data();
                this.setState({
                    key: doc.id,
                    name: timer.name,
                    task: timer.task,
                    time: timer.time,
                    isLoading: false
                });
            } else {
                console.log("No such document!");
            }
        });
    }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    updateTimer() {
        this.setState({
            isLoading: true,
        });
        const { navigation } = this.props;
        const updateRef = firebase.firestore().collection('timers').doc(this.state.key);
        updateRef.set({
            name: this.state.name,
            task: this.state.task,
            time: this.state.time,
        }).then((docRef) => {
            this.setState({
                key: '',
                name: '',
                task: '',
                time: 0,
                isLoading: false,
            });
            this.props.navigation.navigate('Timer');
        })
            .catch((error) => {
                console.error("Error adding document: ", error);
                this.setState({
                    isLoading: false,
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
                    <TextInput
                        placeholder={'Name'}
                        value={this.state.name}
                        onChangeText={(text) => this.updateTextInput(text, 'name')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        placeholder={'Task'}
                        value={this.state.task}
                        onChangeText={(text) => this.updateTextInput(text, 'task')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Time'}
                        value={this.state.time}
                        onChangeText={(text) => this.updateTextInput(text, 'time')}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{name: 'update'}}
                        title='Update'
                        onPress={() => this.updateTimer()} />
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
    }
})

export default EditTimerScreen;