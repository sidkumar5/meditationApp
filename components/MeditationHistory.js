
import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View } from 'react-native';
import {  ListItem, Text, Card, Button , Avatar} from 'react-native-elements';
import {  Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from "../Firebase";
import * as docRef from "timm";


class MeditationHistory extends Component {

    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('MeditationHistory').orderBy('name');
        this.unsubscribe = null;
        this.state = {
            isLoading: true,
            MeditationHistory: []
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const MeditationHistory = [];
        querySnapshot.forEach((doc) => {
            const { name, totalTime,image,userName,medidatedAt } = doc.data();
            MeditationHistory.push({
                key: doc.id,
                doc, // DocumentSnapshot
                name,
                totalTime,
                image,
                userName,
                medidatedAt,
            });
        });
        console.log("Setting state");
        console.log(this.state);
        console.log(MeditationHistory['name']);
        this.setState({
            MeditationHistory : MeditationHistory,
            isLoading: false,
        });
        console.log("After setting state");
        console.log(MeditationHistory);
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }


    static navigationOptions = ({ navigation }) => {
        return {
            title: 'My History',

        };
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

                {
                    this.state.MeditationHistory.map((item, i) => (
                        <ListItem
                            key={i}
                            bottomDivider

                        >
                            <Avatar source={{uri: item.image}} />
                            <ListItem.Content>
                                <ListItem.Title >{item.name}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem.Title >{item.totalTime}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem >{item.medidatedAt}</ListItem>
                            </ListItem.Content>
                            <ListItem.Content>
                                <ListItem.Title >{item.userName}</ListItem.Title>
                            </ListItem.Content>







                        </ListItem>
                    ))
                }

            </ScrollView>
        );
    }
}

// <ListItem key={i} bottomDivider >
//     <ListItem.Content>
//         <ListItem.Title >{item.name}</ListItem.Title>
//
//    </ListItem.Content>

//  </ListItem>








const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
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

export default MeditationHistory;