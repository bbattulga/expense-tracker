import React, {useState, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Form,
		Item,
		Input,
		Label,
		Text,
		Card,
		CardItem,
		Toast,
		Button} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import ThemeContext from '../../context/ThemeContext';
import {localized, setLocale} from '../../localization/Localize';
import LanguagePicker from '../lang/LanguagePicker';


const Signup = (props) => {

	const [first_name, setfname] = useState('');
	const [last_name, setlname] = useState('');
	const [password, setPwd] = useState('');
	const [password2, setPwd2] = useState('');
	const [email, setEmail] = useState('');
	const [lang, setLang] = useState('');
	const [theme, _] = useContext(ThemeContext);

	const handleCallback = (user) => {
		setfname(user.first_name);
		setlname(user.last_name);
		setEmail(user.email);
		setPwd(user.password);
	}
	const handleSubmit = () => {
		if (!props.onSubmit)
			return;
		if (password !== password2){
			Toast.show({text: 'password does not match'});
			return;
		}
		let user = {
			id: null,
			first_name,
			last_name,
			password,
			email
		}
		props.onSubmit(user, handleCallback);
	}
	const handleChangeLang = (lang) => {
		setLocale(lang);
		setLang(lang);
		AsyncStorage.setItem('lang', lang);
	}

	return (
		<Card>
			<CardItem header>
				<Text style={{fontSize: 22}}>{localized('CNA')}</Text>
			</CardItem>
			<CardItem>
				<Form style={styles.form}>
					<Item floatingLabel
						style={styles.formItem}>
						<Label style={styles.label}>{localized('firstName')}</Label>
						<Input value={first_name}
							onChangeText={setfname}
							style={styles.input} />
					</Item>
					<Item floatingLabel
						style={styles.formItem}>
						<Label style={styles.label}>{localized('lastName')}</Label>
						<Input value={last_name}
							onChangeText={setlname}
							style={styles.input} />
					</Item>
					<Item floatingLabel
						style={styles.formItem}>
						<Label style={styles.label}>{localized('email')}</Label>
						<Input value={email}
							onChangeText={setEmail}
							style={styles.input} />
					</Item>
					<Item floatingLabel
						style={styles.formItem}>
						<Label style={styles.label}>{localized('password')}</Label>
						<Input value={password}
							onChangeText={setPwd}
							secureTextEntry={true}
							style={styles.input} />
					</Item>
					<Item floatingLabel
						style={styles.formItem}>
						<Label style={styles.label}>{localized('confirmPassword')}</Label>
						<Input value={password2}
							onChangeText={setPwd2}
							secureTextEntry={true}
							style={styles.input} />
					</Item>
				</Form>
			</CardItem>
			<CardItem footer style={{alignSelf: 'flex-end'}}>
				<LanguagePicker onSelect={handleChangeLang} />
				<Button onPress={handleSubmit}>
					<Text>{localized('register')}</Text>
				</Button>
			</CardItem>
		</Card>
		)
}

const styles = StyleSheet.create({
	form: {
		flex: 1,
	},
	formItem: {

	},
	label: {

	},
	input: {

	}
});

export default Signup;