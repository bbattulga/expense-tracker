import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { setLocale } from '../../localization/Localize';
import Picker from '../picker/Picker2';


const langs = ['en', 'mn'];

const LanguagePicker = (props) => {

	const { onSelect } = props;
	const [lang, setLang] = useState(langs[0]);

	const handleChangeLang = (lang) => {
		setLang(lang);
		if (onSelect) {
			onSelect(lang);
		}
	}

	useEffect(() => {
		(async () => {
			const lang = await AsyncStorage.getItem('lang');
			setLang(lang);
		})();
	}, []);

	return (
		<Picker selectedValue={lang}
			onValueChange={handleChangeLang}
			{...props}>
			{langs.map(la => <Picker.Item label={la} value={la} />)}
		</Picker>
	)
}

export default LanguagePicker;