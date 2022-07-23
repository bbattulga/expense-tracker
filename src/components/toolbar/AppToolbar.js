import React, {useState, useEffect, useContext} from 'react';
import {Container,
		Content,
		Left,
		Body,
		Right,
		Text,
		Header} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import ThemeContext from '../../context/ThemeContext';


export default function AppToolbar(props){

	const navigation = useNavigation();
	const [menuColor, setMenuColor] = useState('#f0f0f0');
	const [theme, _] = useContext(ThemeContext);

	// onMount
	useEffect(() => {
		(async () => {
			let theme = await AsyncStorage.getItem('theme');
			if (theme === 'light')
				setMenuColor('#333');
			else
				setMenuColor('#f0f0f0');
		})();
	}, []);

	return (
		<Header>
			<Left>
				<Icon onPress={() => navigation?.toggleDrawer()} color={menuColor} name="menu" size={21} />
			</Left>
			<Body>
				<Text>Expense tracker</Text>
			</Body>
		</Header>
		)
}