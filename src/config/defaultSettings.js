import AsyncStorage from '@react-native-community/async-storage';


export default async function defaultSettings() {
	let lang = await AsyncStorage.getItem('lang');
	if (!lang)
		await AsyncStorage.setItem('lang', 'en');
	return true;
}