import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet, RefreshControl, Alert} from 'react-native';
import {View,
		Text,
		Card,
		CardItem,
		Content,
		Button,
		DatePicker} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';

import Screen from '../components/screen/Screen';
import * as Query from '../database/query';
import ThemeContext from '../context/ThemeContext';
import Modal from '../components/modal/ModalContainer';
import ModalContent from '../components/modal/ModalContent';
import DateRangePicker from '../components/date/DateRangePicker';
import Transaction from '../components/transaction/Transaction';
import EditTransaction from '../components/transaction/EditTransaction';
import {localized} from '../localization/Localize';


const HistoryScreen = (props) => {

	const [theme, _] = useContext(ThemeContext);
	const [selectedTx, setSelectedTx] = useState(null);
	const [showEdit, setShowEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const [histories, setHistories] = useState([]);
	const [types, setTypes] = useState([]);
	const [dateRange, setDateRange] = useState([new moment().subtract(7, 'days').toDate(), new Date()]);

	const fetch = useCallback(() => {
		(async () => {
			setLoading(true);
			let d1 = new moment(dateRange[0]).format('YYYY-MM-DD 00:00:00');
			let d2 = new moment(dateRange[1]).format('YYYY-MM-DD 23:59:59');
			let h = await Query.fetchTransactions(d1, d2);
			let t = await Query.fetchTransactionCategories();
			setHistories(h);
			setTypes(t);
			setLoading(false);
		})();
	}, []);

	// run on revery focus event
	useFocusEffect(fetch);

	const handleDateSelect = (d1, d2) => {
		setDateRange([d1, d2]);
		fetch(d1, d2);
	}

	const handleDelete = (tx) => {
		setLoading(true);
		(async () => {
			try{
				await Query.deleteTransaction(tx.id);
				// update budget
				const date = new moment(tx.create_at).format('YYYY-MM-DD');
				let budget = await Query.budgetDay(date);
				budget.amount -= parseInt(tx.amount);
				await Query.updateBudget(budget);
			}catch(err){
				console.log(err);
			}
			setHistories(histories.filter(t => t.id != tx.id));
			setLoading(false);
		})();
	}

	const handleClickDelete = (tx) => {
		const title = localized('makeSureDeleteTransaction');
		const body = `${tx.amount}\n${tx.description}\n${tx.created_at}`;
		Alert.alert(title, body, [
				{text: localized('cancel')},
				{text: localized('yes'), onPress: () => handleDelete(tx)}
			])
	}

	const handleClickEdit = (tx) => {
		setSelectedTx(tx);
		setShowEdit(true);
	}

	const handleEdit = (tx) => {
		(async () => {
			setShowEdit(false);
			setLoading(true);
			await Query.updateTransaction(tx);

			let prev;
			for (let i=0; i<histories.length; i++){
				if (histories[i].id === tx.id){
					prev = histories[i];
					histories[i] = tx;
					break;
				}
			}
			tx.type = types.find(t => t.id === tx.category_id);
			// may update budget
			const deltaAmount = prev.amount - tx.amount;
			console.log(deltaAmount);
			if (deltaAmount){
				let budget = await Query.budgetDay(new moment(tx.created_at).format('YYYY-MM-DD'));
				budget.amount -= deltaAmount;
				await Query.updateBudget(budget);
			}
			setHistories(histories);
			setLoading(false);
		})();
	}

	return (
		<Screen>
			<Content refreshControl={<RefreshControl refreshing={loading} onRefresh={fetch} />}>
			<Card>
				<CardItem>
					<DateRangePicker onSelect={handleDateSelect}
									date1={dateRange[0]}
									date2={dateRange[1]} />
				</CardItem>
			</Card>
				<View style={styles.historiesContainer}>
					{histories.map(h => <Transaction key={h.id}
											onDelete={handleClickDelete} 
											onEdit={handleClickEdit}
											transaction={h} />)}
				</View>
			</Content>
			<Modal visible={showEdit} onPress={() => setShowEdit(false)}
					onClose={() => setShowEdit(false)}>
				<ModalContent>
					<EditTransaction transaction={selectedTx} 
									onSubmit={handleEdit} />
				</ModalContent>
			</Modal>
		</Screen>
		)
}

const styles = StyleSheet.create({
	del: {
		position: 'absolute',
		flexDirection: 'row',
		top: 7,
		right: 7
	},
	fetcherContainer: {
		flex: 1,
		margin: 10
	},
	historiesContainer: {
		flexDirection: 'column-reverse'
	}
});

export default HistoryScreen;