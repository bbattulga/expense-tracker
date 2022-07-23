import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet, RefreshControl} from 'react-native';
import {View,
		Text,
		Card,
		CardItem,
		Item,
		Label,
		Input,
		Button,
		Toast,
		Form} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';

import Screen from '../components/screen/Screen';
import * as Query from '../database/query';
import * as Database from '../database/Database';
import {localized} from '../localization/Localize';
import TransactionTypePicker from '../components/picker/TransactionTypePicker';
import ThemeContext from '../context/ThemeContext';


let typeId;
const handleSelectType = (id) => {
	typeId = id;
}

const BudgetChargeScreen = (props) => {

	const [budget, setBudget] = useState('');
	const [description, setDescription] = useState('');
	const [chargeAmount, setChargeAmount] = useState('');
	const [types, setTypes] = useState([]);
	const [theme, _] = useContext(ThemeContext);

	useFocusEffect(
		useCallback(() => {
			(async () => {
				let budget = await Query.budgetDay(new moment().format('YYYY-MM-DD'));
				setBudget(budget);
			})()
		}, [])
	);

	const handleSubmit = () => {

		if (chargeAmount.length === 0)
			return;
		if (!chargeAmount.match(/^\d+$/)){
			Toast.show({text: localized('invalidInput')});
			return;
		}

		if (!typeId){
			Toast.show({text: localized('transactionTypeNotSelected'), duration: 1500});
			return;
		}

		(async () => {
			let chargedBudget = {
				id: budget.id,
				amount: parseInt(budget.amount)+parseInt(chargeAmount)
			}
			let u = await Query.updateBudget(chargedBudget);
			let tx = {
				amount: chargeAmount,
				category_id: typeId,
				description: description,
				created_at: new moment().format('YYYY-MM-DD HH:mm:ss')
			}
			setBudget(chargedBudget);
			setDescription('');
			setChargeAmount('');
			Toast.show({text: localized('transactionSuccess'), duration: 2000});
			Query.createTransaction(tx);
		})();
	}

	return (
		<Screen>
			<Card>
			<CardItem header>
				<Text>{localized('budget')}: {budget.amount}</Text>
			</CardItem>
			<CardItem>
				<Form style={styles.form}>
					<Item floatingLabel
						style={styles.formItem}>
						<Label style={styles.label}>{localized('chargeAmount')}</Label>
						<Input onChangeText={text => setChargeAmount(text) }
							value={chargeAmount}
							style={styles.input} />
					</Item>
					<Item floatingLabel
						style={styles.formItem}>
						<Label style={styles.label}>{localized('description')}</Label>
						<Input onChangeText={setDescription}
							value={description}
							style={styles.input} />
					</Item>
					<Item style={styles.picker}>
						<Label>{localized('category')}</Label>
						<TransactionTypePicker onSelect={handleSelectType} />
					</Item>
				</Form>
			</CardItem>
			<CardItem footer
					style={styles.submit}>
				<Button onPress={handleSubmit}
					style={styles.submit}>
					<Text>{localized('charge')}</Text>
				</Button>
			</CardItem>
		</Card>
		</Screen>
		)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	form: {
		flex: 1
	},
	formItem: {

	},
	input: {

	},
	label: {

	},
	submit: {
		alignSelf: 'flex-end'
	},
	picker: {
		marginTop: 30
	},
});

export default BudgetChargeScreen;