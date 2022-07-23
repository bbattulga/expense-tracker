import React, {useState, useCallback, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Text,
		Card,
		CardItem,
		Form,
		Item,
		Input,
		Label,
		Button,
		Content,
		Toast} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Restart} from 'fiction-expo-restart';

import Screen from '../components/screen/Screen';
import * as Query from '../database/query';
import {localized} from '../localization/Localize';
import ThemeContext from '../context/ThemeContext';

// holds user reference
let user = null;

const EditUserScreen = (props) => {

	const [loading, setLoading] = useState(false);
	const [showPwdField, setShowPwdField] = useState(false);
	const [fname, setfname] = useState('');
	const [lname, setlname] = useState('');
	const [email, setEmail] = useState('');
	const [pwd, setP1] = useState('');
	const [pwd2, setP2] = useState('');
	const [theme, _] = useContext(ThemeContext);

	useFocusEffect(
		useCallback(() => {
			(async () => {
				setLoading(true);
				const userjson = await AsyncStorage.getItem('user');
				user = JSON.parse(userjson);
				setfname(user.first_name);
				setlname(user.last_name);
				setEmail(user.email);
				setLoading(false);
			})();
		}, [])
	);

	const renderPwdField = () => {
		if (!showPwdField)
			return;
		return (
			<>
			<Item floatingLabel
				style={styles.formItem}>
				<Label style={styles.label}>{localized('newPassword')}</Label>
				<Input value={pwd}
					onChangeText={setP1}
					secureTextEntry={true}
					style={styles.input}/>
			</Item>
			<Item floatingLabel
				style={styles.formItem}>
				<Label style={styles.label}>{localized('confirmPassword')}</Label>
				<Input value={pwd2}
					onChangeText={setP2}
					secureTextEntry={true}
					style={styles.input}/>
			</Item>
			</>
			)
	}

	const handleSubmit = () => {
		if ((pwd.length > 0) && pwd !== pwd2){
			Toast.show({text: 'Password does not match'});
			return;
		}
		(async () => {
			if (pwd.length != 0)
				user.password = pwd;
			user.first_name = fname;
			user.last_name = lname;
			user.email = email;
			try{
				await Query.updateUser(user);
				Toast.show({text: localized('saved'), duration: 1000});
				Restart();
			}catch(err){
				Toast.show({text: 'Something went wrong'});
				console.log(err);
			}
		})();
	}

	return (
		<Screen header={false}>
			<Content>
				<Card>
					<CardItem>
						<Form style={styles.form}>
							<Item floatingLabel
								style={styles.formItem}>
								<Label style={styles.label}>{localized('firstName')}</Label>
								<Input value={fname}
									onChangeText={setfname}
									style={styles.input}/>
							</Item>
							<Item floatingLabel
								style={styles.formItem}>
								<Label style={styles.label}>{localized('lastName')}</Label>
								<Input value={lname}
									onChangeText={setlname}
									style={styles.input}/>
							</Item>
							<Item floatingLabel
								style={styles.formItem}>
								<Label style={styles.label}>{localized('email')}</Label>
								<Input value={email}
									onChangeText={setEmail}
									style={styles.input}/>
							</Item>
							<Item style={styles.togglePwdContainer}>
								<Button small dark rounded
									onPress={() => setShowPwdField(!showPwdField)}>
									<Text>{showPwdField? localized('close'):localized('changePassword')}</Text>
								</Button>
							</Item>
							{renderPwdField()}
						</Form>
					</CardItem>
					<CardItem footer
							style={styles.submit}>
						<Button onPress={handleSubmit}>
							<Text>{localized('save')}</Text>
						</Button>
					</CardItem>
				</Card>
			</Content>
		</Screen>
		)
}

const styles = StyleSheet.create({
	form: {
		flex: 1
	},
	formItem: {

	},
	label: {

	},
	submit: {
		alignSelf: 'flex-end'
	},
	input: {

	},
	togglePwdContainer: {
		borderColor: 'transparent',
		marginTop: 30
	}
});

export default EditUserScreen;