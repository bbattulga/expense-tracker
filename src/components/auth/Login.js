import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Form,
		Item,
		Input,
		Label,
		Text,
		Card,
		CardItem,
		Button} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import ThemeContext from '../../context/ThemeContext';
import {localized} from '../../localization/Localize';


const Login = (props) => {

	const [password, setPwd] = useState('');
	const [email, setEmail] = useState('');
	const [theme, _]  = useContext(ThemeContext);

	const handleSubmit = () => {
		if (!props.onSubmit)
			return;
		let user = {
			email,
			password
		}
		props.onSubmit(user);
	}

	return (
		<Card>
			<CardItem>
				<Form style={styles.form}>
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
				</Form>
			</CardItem>
			<CardItem footer style={{alignSelf: 'center', flexDirection: 'column'}}>
				<View>
					<Button onPress={handleSubmit}>
					<Text>{localized('login')}</Text>
				</Button>
				</View>
				
				<View style={styles.footer}>
					{props.children}
				</View>
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

	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
});

export default Login;