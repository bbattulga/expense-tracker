import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Content,
		View,
		Text,
		Form,
		Label,
		Item,
		Picker,
		Card,
		CardItem,
		Button} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {Restart} from 'fiction-expo-restart';

import Screen from '../components/screen/Screen';
import ThemeContext from '../context/ThemeContext';
import {localized, setLocale} from '../localization/Localize';


export default function SettingsScreen(props){

	const [loading, setLoading] = useState(false);
	const [lang, setLang] = useState('');
	const [theme, setTheme] = useContext(ThemeContext);

	const handleChangeLang = (lang) => {
		setLang(lang);
		setLocale(lang);
		AsyncStorage.setItem('lang', lang);
	}

	const handleChangeTheme = (otherTheme) => {
		setTheme(otherTheme);
		(async () => {
			await AsyncStorage.setItem('theme', otherTheme);
		})();
	}

	// onMount
	useEffect(() => {
		 if (process.env.DEBUG)
      		console.log('settings screen onMount');
		(async () => {
			let lang = await AsyncStorage.getItem('lang');
			let theme = await AsyncStorage.getItem('theme');
			setLang(lang);
			setTheme(theme);
		})();
	}, []);

	if (loading){
		return (
			<Screen>
				<Content>
					<Text>loading</Text>
				</Content>
			</Screen>
			)
	}
	return (
		<Screen>
			<Content contentContainerStyle={styles.container}>
				<Card>
					<CardItem>
						<Form style={styles.form}>
							<Item>
								<Label>{localized('language')}</Label>
								<Picker selectedValue={lang}
									onValueChange={handleChangeLang}
									style={{color: theme === 'light'? '#333':'#e0e0e0'}}>
									<Picker.Item label="en-US" value={'en'}/>
									<Picker.Item label="mn-MN" value={'mn'}/>
								</Picker>
							</Item>
							<Item>
								<Label>{localized('theme')}</Label>
								<Picker onValueChange={handleChangeTheme}
									selectedValue={theme}
									style={{color: theme === 'light'? '#333':'#e0e0e0'}}>
									<Picker.Item label="dark" value={'dark'} />
									<Picker.Item label="light" value={'light'} />
								</Picker>
							</Item>
						</Form>
					</CardItem>
				</Card>
			</Content>
		</Screen>
		)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	picker: {
		alignSelf: 'flex-end'
	},
	form: {
		flex: 1
	}
})