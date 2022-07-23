import React from 'react';
import {ImageBackground, StyleSheet, Platform, StatusBar} from 'react-native';

const AuthBackground = (props) => {
	return (
		<ImageBackground source={require('../../../assets/loginbg.jpg')}
			style={StyleSheet.flatten([styles.image, props.style])}>
			{props.children}
		</ImageBackground>
		)
}

const styles = StyleSheet.create({
	image: {
		// marginTop: Platform.OS === 'android'? StatusBar.currentHeight: 0,
		flex: 1,
		resizeMode: 'cover'
	}
});


export default AuthBackground;