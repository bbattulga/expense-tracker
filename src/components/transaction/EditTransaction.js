import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Card,
		CardItem,
		Textarea,
		Form,
		Item,
		Input,
		Label,
		Button,
		Spinner,
		Text} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';

import * as Query from '../../database/query';
import DatePicker from '../date/DatePicker2';
import Picker from '../picker/Picker2';
import ThemeContext from '../../context/ThemeContext';
import {localized} from '../../localization/Localize';


const EditTransaction = (props) => {

	const {transaction, onSubmit, title} = props;
	const [loading, setLoading] = useState(true);
	const [types, setTypes] = useState([]);
	const [type, setType] = useState(null);
	const [tx, setTx] = useState(null);
	const [theme, _] = useContext(ThemeContext);

	useEffect(() => {

		(async () => {
			setLoading(true);
			let types = await Query.fetchTransactionCategories();
			setType(transaction.category_id);
			setTypes(types);
			setTx({...transaction});
			setLoading(false);
		})();
		
	}, [transaction]);

	const handleSubmit = () => {
		if (onSubmit){
			tx.category_id = type;
			tx.created_at = new moment(tx.created_at).format('YYYY-MM-DD HH:mm:ss');
			onSubmit(tx, transaction);
		}
	}

	const renderForm = () => {
		if (loading)
			return <></>
		return (
			<Form style={styles.form}>
				<Item fixedLabel>
					<Label>{localized('transactionAmount')}</Label>
					<Input value={''+tx.amount}
						onChangeText={amount => setTx({...tx, amount})}/>
				</Item>
				<Item floatingLabel>
					<Label>{localized('description')}</Label>
					<Input value={tx.description}
						onChangeText={description => setTx({...tx, description})}/>
				</Item>
				<Item>
					<Label>{localized('category')}</Label>
					<Picker selectedValue={type}
							onValueChange={setType}>
						{types.map(t => <Picker.Item label={t.name} value={t.id} />)}
					</Picker>
				</Item>
				<Item fixedLabel>
					<Label>{localized('date')}</Label>
					<DatePicker defaultDate={new moment(tx.create_at).toDate()}
							onDateChange={(d) => setTx({...tx, created_at: d})}
							textStyle={{color: theme === 'light'? '#333':'#e0e0e0'}} />
				</Item>
			</Form>
			)
	}
	return (
		<>
			<CardItem header>
				<Text>{title? title:localized('editTransaction')}</Text>
			</CardItem>
			<CardItem>
				{renderForm()}
			</CardItem>
			<CardItem footer
				style={styles.submit}>
				<Button onPress={handleSubmit}>
					<Text>{localized('save')}</Text>
				</Button>
			</CardItem>
			</>
		)
}

const styles = StyleSheet.create({
	form: {
		flex: 1
	},
	card: {
		width: '80%'
	},
	submit: {
		alignSelf: 'flex-end'
	}
})

export default EditTransaction;