import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {View, StyleSheet, Image} from 'react-native';
import {Text, Spinner} from 'native-base';


export default function LoadingScreen(props){

	return (
		<>
		<View style={styles.container}>
			<Spinner color={'#000'}/>
		</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		flex: 1,
		resizeMode: 'cover'
	}
})