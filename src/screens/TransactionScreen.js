import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Content,
		View,
		Form,
		Item,
		Label,
		Button,
		Text,
		Input,
		Card,
		CardItem,
		Toast} from 'native-base';
import {RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';

import Screen from '../components/screen/Screen';
import Transaction from '../components/transaction/Transaction';
import Picker from '../components/picker/Picker2';
import * as Query from '../database/query';
import {localized} from '../localization/Localize';
import ThemeContext from '../context/ThemeContext';
import RadioButton from '../components/radio/RadioButton';


let types = [];

export default function TransactionScreen(props){

	const [budget, setBudget] = useState(null);
	const [outcome, setOutcome] = useState(true);
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState(null);
	const [description, setDescription] = useState(null);
	const [type, setType] = useState(null);
	const [theme, _] = useContext(ThemeContext);

	// run on every focus event
	useFocusEffect(
		useCallback(() => {
			(async () => {
				setLoading(true);
				let t = await Query.fetchTransactionCategories();
				let budget = await Query.budgetDay(new moment().format('YYYY-MM-DD'));
				setBudget(budget);
				types = t;
				setType(t[0]?.id);
				setLoading(false);
			})();
		}, [])
	);

	const handleChangeType = (id) => {
		setType(id);
		if (process.env.DEBUG)
			console.log(id);
	}

	const handleSubmit = () => {

		if (loading)
			return;

		if (!amount)
			return;
		
		if ((''+amount).length == 0)
			return;

		if (!amount.match(/^\d+$/)){
			Toast.show({text: localized('invalidInput')});
			return;
		}

		if (outcome && (amount > budget.amount)){
			Toast.show({text: localized('notEnoughMoney'), duration: 1500});
			return;
		}

		if (!type){
			Toast.show({text: localized('transactionTypeNotSelected'), duration: 1500});
			return;
		}

		// then update budget in db
		let budgetUpdate = {...budget};
		if (outcome)
			budgetUpdate.amount -= Math.abs(amount);
		else
			budgetUpdate.amount += Math.abs(amount);

		(async () => {
			setLoading(true);
			let tx = {
				amount: outcome? -Math.abs(amount):Math.abs(amount),
				category_id: type,
				description,
				created_at: new moment().format('YYYY-MM-DD HH:mm:ss')
			}
			if (process.env.DEBUG){
				console.log('transaction');
				console.log(tx);
			}

			try{
				await Query.createTransaction(tx);
				await Query.updateBudget(budgetUpdate);
			}catch(err){
				console.log(err);
				Toast.show({text: localized('error')});
				return;
			}
			
			setAmount(null);
			setBudget(budgetUpdate);
			setDescription(null);
			setType(types[0].id);
			setLoading(false);
			Toast.show({text: localized('transactionSuccess')});
		})();
	}

	return (
		<Screen>
			<Content contentContainerStyle={styles.container}
					refreshControl={<RefreshControl refreshing={loading} />}>
				<View style={{padding: 8}}>
					<Card>
						<CardItem header>
							<Text>{localized('transaction')}</Text>
						</CardItem>
						<CardItem>
							<Form style={styles.form}>
								<Item floatingLabel
										style={styles.formItem}>
									<Label style={styles.label}>{localized('transactionAmount')}</Label>
									<Input value={amount}
										keyboardType={'numeric'}
										onChangeText={text => setAmount(text)}
										style={styles.input} />
								</Item>
								<Item floatingLabel
										style={styles.formItem}>
									<Label style={styles.label}>{localized('description')}</Label>
									<Input value={description}
										onChangeText={text => setDescription(text)}
										style={styles.input} />
								</Item>
								<Item style={styles.picker}>
									<Label>{localized('category')}</Label>
									<Picker selectedValue={type}
											onValueChange={handleChangeType}>
										{types.map(t => <Picker.Item key={t.id} label={t.name} value={t.id} />)}
									</Picker>
								</Item>
								<Item style={styles.radioItem}>
									<View style={styles.radioRow}>
										<RadioButton selected={outcome}
											onPress={() => setOutcome(true)}
											containerStyle={styles.radio} text={localized('expense')} />
										<RadioButton selected={!outcome}
											onPress={() => setOutcome(false)}
											containerStyle={styles.radio} text={localized('income')} />
									</View>
								</Item>
							</Form>
						</CardItem>
						<CardItem footer
								style={styles.submit}>
							<Button onPress={handleSubmit}>
								<Text>{localized('submit')}</Text>
							</Button>
						</CardItem>
					</Card>
				</View>
			</Content>
		</Screen>
		)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	form: {
		flex: 1,
	},
	formItem: {

	},
	label: {

	},
	input: {

	},
	picker: {
		marginTop: 30
	},
	submit: {
		alignSelf: 'flex-end'
	},
	radioItem: {
		marginTop: 20,
		borderColor: 'transparent'
	},
	radio: {
		marginRight: 30
	},
	radioRow: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 10
	}
})