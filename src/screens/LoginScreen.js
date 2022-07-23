import React, {useState, useCallback, useEffect} from 'react';
import {StyleSheet, RefreshControl, View, ImageBackground} from 'react-native';
import {
		Content,
		Card,
		Toast,
		CardItem,
		Text} from 'native-base';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import Screen from '../components/screen/Screen';
import Login from '../components/auth/Login';
import * as Query from '../database/query';
import AuthBackground from '../components/background/AuthBackground';
import Picker from '../components/picker/Picker2';
import {localized, setLocale} from '../localization/Localize';

// for simplicity
const langs = ['en', 'mn'];

const LoginScreen = (props) => {

	const navigation = useNavigation();
	const [loading, setLoading] = useState(false);
	const [lang, setLang] = useState(langs[0]);

	const handleSubmit = useCallback(({email, password}) => {
		(async () => {
			setLoading(true);
			let u = await Query.login(email, password);
			if (!u){
				Toast.show({text: localized('loginFail')});
				setLoading(false);
				return;
			}
			await AsyncStorage.setItem('user', JSON.stringify(u));
			navigation.replace('Main');
		})();
	}, []);

	useEffect(() => {
		(async () => {
			const lang = await AsyncStorage.getItem('lang');
			setLang(lang);
			setLocale(lang);
		})();
	}, []);

	const handleChangeLang = (lang) => {
		setLocale(lang);
		setLang(lang);
		 AsyncStorage.setItem('lang', lang);
	}

	return (
		<Screen header={false}>
			<Content refreshControl={<RefreshControl refreshing={loading} />}
					contentContainerStyle={styles.container}>
					<AuthBackground style={styles.bgImage}>
						<Login onSubmit={handleSubmit}>
							<Picker selectedValue={lang}
									onValueChange={handleChangeLang}>
								{langs.map(la => <Picker.Item label={la} value={la} />)}
							</Picker>
							<Text style={styles.forgot}>{localized('forgotPassword')}</Text>
						</Login>
					</AuthBackground>
			</Content>
		</Screen>
		)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	bgImage: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		resizeMode: 'cover'
	},
	forgot: {
		fontSize: 10,
		color: '#ccc'
	}
});

export default LoginScreen;