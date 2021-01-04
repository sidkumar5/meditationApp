import React, { Component } from 'react';
import {StyleSheet, ScrollView, ActivityIndicator, View, Dimensions} from 'react-native';
import {ListItem, Text, Card, Button, Icon, Avatar} from 'react-native-elements';
import firebase from '../Firebase';

class TimerDetailScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: JSON.parse(navigation.getParam('timerName', 'Timer Details')),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.refDetails = firebase.firestore().collection('timers').doc(JSON.parse(navigation.getParam('timerkey'))).collection('tasks').orderBy('sequenceNumber');

        this.state = {
            isLoading: true,
            timers: {},
            key: ''
        };
    }

    componentDidMount() {
        const { navigation } = this.props;

        const ref = firebase.firestore().collection('timers').doc(JSON.parse(navigation.getParam('timerkey')));
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
        tasks.sort((a, b) => (Number(a.sequenceNumber) > Number(b.sequenceNumber)) ? 1 : -1)
        this.setState({
            tasks : tasks
        });


    }





    deleteTimer(key) {
        const { navigation } = this.props;
        this.setState({
            isLoading: true
        });
        firebase.firestore().collection('timers').doc(key).delete().then(() => {
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
                                        this.props.navigation.navigate('EditTaskScreen', {
                                            taskkey: `${JSON.stringify(item.key)}`,
                                            timerkey: `${JSON.stringify(this.state.timerkey)}`,
                                        });
                                    }}

                                >
                                    <Avatar source={{uri: item.taskImage}} />
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
                    <View style={styles.containerTest}>
                    <View style={styles.buttonContainer}>
                        <Button styles={styles.button}
                            large
                            backgroundColor={'#CCCCCC'}
                            leftIcon={{name: 'edit'}}
                            title='Run Timer'
                            onPress={() => {
                                this.props.navigation.navigate('RunTimer', {
                                    timerkey: `${JSON.stringify(this.state.key)}`,
                                });
                            }} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button styles={styles.button}
                            large
                            backgroundColor={'#CCCCCC'}
                            leftIcon={{name: 'edit'}}
                            title='Add Task'
                            onPress={() => {
                                this.props.navigation.navigate('AddTask', {
                                    timerkey: `${JSON.stringify(this.state.timerkey)}`,
                                });
                            }} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button styles={styles.button}
                            large
                            backgroundColor={'#CCCCCC'}
                            leftIcon={{name: 'edit'}}
                            title='Edit Timer'
                            onPress={() => {
                                this.props.navigation.navigate('EditTimer', {
                                    timerkey: `${JSON.stringify(this.state.key)}`,
                                });
                            }} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button styles={styles.button}
                            large
                            backgroundColor={'#999999'}
                            color={'#FFFFFF'}
                            leftIcon={{name: 'delete'}}
                            title='Delete Timer'
                            onPress={() => this.deleteTimer(this.state.key)} />
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
        marginTop: 10
    },
    containerTest: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        //width: Dimensions.get('window').width * .75,
        paddingBottom: 10
    },
    buttonContainer: {
        flex: 1,
        textAlign: 'justify',
        alignItems: 'center',
        //width: Dimensions.get('window').width * .60


    },
    button: {
        width: Dimensions.get('window').width * 2,
    }
})

export default TimerDetailScreen;

