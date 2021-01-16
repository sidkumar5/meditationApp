import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import {  ListItem, Text, Card, Button , Avatar} from 'react-native-elements';
import firebase from '../Firebase';
import {  Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

class TimerDetailScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: JSON.parse(navigation.getParam('timerName', 'Timer Details')),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.refDetails = firebase.firestore().collection('meditations').doc(JSON.parse(navigation.getParam('timerkey'))).collection('tasks').orderBy('sequenceNumber');

        this.state = {
            isLoading: true,
            timers: {},
            key: ''
        };
    }

    componentDidMount() {
        const { navigation } = this.props;

        const ref = firebase.firestore().collection('meditations').doc(JSON.parse(navigation.getParam('timerkey')));
        this.unsubscribe = this.refDetails.onSnapshot(this.onCollectionUpdate);
        ref.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    timer: doc.data(),
                    key: doc.id,
                    isLoading: false,
                    timerkey:JSON.parse(navigation.getParam('timerkey')),
                });

            } else {
                console.log("No such document!");
            }
        });

    }



    onCollectionUpdate = (querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
            const { taskName, timeSeconds, sequenceNumber, image } = doc.data();
            console.log("Tasks data")
            console.log(doc.data());
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
        tasks.sort((a, b) => (Number(a.sequenceNumber) > Number(b.sequenceNumber)) ? 1 : -1)
        this.setState({
            tasks : tasks
        });
        console.log("After setting the state");
        console.log(tasks.length);
        console.log(tasks[0]);


    }




    deleteTimer(key) {
        const { navigation } = this.props;
        this.setState({
            isLoading: true
        });
        firebase.firestore().collection('meditations').doc(key).delete().then(() => {
            console.log("Document successfully deleted!");
            this.setState({
                isLoading: false
            });
            navigation.navigate('Timer');
        }).catch((error) => {
            console.error("Error removing document: ", error);
            this.setState({
                isLoading: false
            });
        });

    }

    createTwoButtonAlert(key) {
        console.log("In the alert function",key);
        //alert('Alert with one button');
        Alert.alert(
            "Confirm",
            "Do you really want to delete",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Ok",
                    onPress: () => this.deleteTimer(this.state.key)
                }
            ],
            { cancelable: true }
        );
    }





    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (
            <ScrollView>
                <Card style={styles.container}>
                    <View style={styles.subContainer}>


                        {
                            this.state.tasks.map((item, i) => (
                                <ListItem
                                    key={i}
                                    bottomDivider
                                    onPress={() => {
                                        console.log("pressed on details");
                                        this.props.navigation.navigate('EditTask', {
                                            taskkey: `${JSON.stringify(item.key)}`,
                                            timerkey: `${JSON.stringify(this.state.timerkey)}`,
                                        });
                                    }}

                                >
                                    <Avatar rounded title="T" source={{uri: item.image}} />
                                    <ListItem.Content>
                                        <ListItem.Title >{item.sequenceNumber}  {item.taskName}</ListItem.Title>
                                        <ListItem.Subtitle >{item.timeSeconds}  Seconds</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem>

                                // <ListItem key={i} bottomDivider >
                                //     <ListItem.Content>
                                //         <ListItem.Title >{item.name}</ListItem.Title>
//
                                //    </ListItem.Content>

                                //  </ListItem>


                            ))
                        }

                    </View>
                    <View style={styles.detailButton}>
                        
                        <View style={{flex:1 , marginLeft:10}} >
                        <Button
                            titleStyle={{
                                color: "white",
                                fontSize: 10,
                            }}
                            small
                            icon={
                                <Icon
                                    name="plus-circle"
                                    size={15}
                                    color="white"
                                />
                            }
                            title="    Add Action"
                            onPress={() => {
                                this.props.navigation.navigate('AddTask', {
                                    timerkey: `${JSON.stringify(this.state.timerkey)}`,
                                });
                            }} />
                        </View>
                        <View style={{flex:1 , marginLeft:10}} >
                        <Button
                            titleStyle={{
                                color: "white",
                                fontSize: 10,
                            }}
                            small
                            icon={
                                <Icon
                                    name="edit"
                                    size={15}
                                    color="white"
                                />
                            }
                            title="    Edit Actions"
                            onPress={() => {
                                this.props.navigation.navigate('EditTimer', {
                                    timerkey: `${JSON.stringify(this.state.key)}`,
                                });
                            }} />
                        </View>
                        <View style={{flex:1 , marginLeft:10}} >
                        <Button
                            titleStyle={{
                                color: "white",
                                fontSize: 10,
                            }}
                            small
                            icon={
                                <Icon
                                    name="trash"
                                    size={15}
                                    color="white"
                                />
                            }
                            title="    Delete"
                            onPress={() => this.createTwoButtonAlert(this.state.key)} />



                        </View>


                    </View>

                </Card>
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
        paddingBottom: 20,
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
    detailButton: {
        marginTop: 10,
        flexDirection: 'row' },

               containerAlert: {
                   flex: 1,
                   justifyContent: "space-around",
                   alignItems: "center"
               }

})

export default TimerDetailScreen;