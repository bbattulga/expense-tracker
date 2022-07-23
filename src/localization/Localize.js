import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-community/async-storage';
import enUS from './en-US';
import mnMN from './mn-MN';

i18n.fallbacks = true;
i18n.translations = {
	en: enUS,
	mn: mnMN
}

// read only
export const locale = i18n.locale;
export const setLocale = (locale) => {
	// may some validation

	i18n.locale = locale;
}
export const localized = (key) => {
	let result = i18n.t(key);
	if (typeof result === 'function')
		return result;

	if (result.includes('missing'))
		return key;
	return result;
}