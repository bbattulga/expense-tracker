import React, {useState, useContext} from 'react';
import {StyleSheet, RefreshControl, Platform, StatusBar} from 'react-native';
import {Content,
		Card,
		CardItem,
		Text,
		Toast} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import Screen from '../components/screen/Screen';
import * as Query from '../database/query';
import Signup from '../components/auth/Signup';
import AuthBackground from '../components/background/AuthBackground';
import ThemeContext from '../context/ThemeContext';

const SignupScreen = (props) => {

	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);
	const [theme, _] = useContext(ThemeContext);


	const handleSubmit = (user, callback) => {
		(async () => {
			setLoading(true);
			let id = await Query.signup(user);
			if (!id){
				Toast.show({text: 'account exists'})
				setLoading(false);
				return;
			}
			user.id = id;
			await AsyncStorage.setItem('user', JSON.stringify(user));
			for (const p of Object.keys(user))
				user[p] = '';
			navigation.replace('Main');
			callback(user);
			setLoading(false);
		})();
	}

	return (
		<Screen header={false}>
			<Content refreshControl={<RefreshControl refreshing={loading} />}
					contentContainerStyle={styles.container} >
				<AuthBackground style={styles.bgImage}>
					<Signup onSubmit={handleSubmit}/>
				</AuthBackground>
			</Content>
		</Screen>
		)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	bgImage: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		resizeMode: 'cover'
	}
});

export default SignupScreen;