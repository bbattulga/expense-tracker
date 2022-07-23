import React, {useState, useCallback, useContext} from 'react';
import {View,
		Text,
		Content,
		Card,
		CardItem,
		Spinner} from 'native-base';
import {StyleSheet, ScrollView, RefreshControl, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';

import Screen from '../components/screen/Screen';
import DateRangePicker from '../components/date/DateRangePicker';
import BudgetLineChart from '../components/chart/BudgetLineChart';
import BudgetHistory from '../components/budget/BudgetHistory';
import ThemeContext from '../context/ThemeContext';
import * as Query from '../database/query';
import Modal from '../components/modal/ModalContainer';
import ModalContent from '../components/modal/ModalContent';
import Transaction from '../components/transaction/Transaction';
import EditTransaction from '../components/transaction/EditTransaction';
import {localized} from '../localization/Localize';


let dateRange = [new moment().subtract(7, 'days').toDate(), new Date()];

const BudgetHistoryScreen = (props) => {

	const [selectedTx, setSelectedTx] = useState(null);
	const [loading, setLoading] = useState(true);
	const [records, setRecords] = useState([]);
	const [types, setTypes] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [showEdit, setShowEdit] = useState(false);
	const [theme, _] = useContext(ThemeContext);

	const fetch = (date1, date2) => {
		(async () => {
			setLoading(true);
			const d1 = new moment(date1).format('YYYY-MM-DD');
			const d2 = new moment(date2).format('YYYY-MM-DD');
			let records = await Query.fetchBudgetRecords(d1, d2);
			const dt1 = new moment(d1).format('YYYY-MM-DD 00:00:00');
			const dt2 = new moment(d2).format('YYYY-MM-DD 23:59:59');
			let txs = await Query.fetchIncomes(dt1, dt2);
			let types = await Query.fetchTransactionCategories();
			setTransactions(txs);
			setRecords(records);
			setTypes(types);
			setLoading(false);
		})()
	}

	const handleDateSelect = (date1, date2) => {
		dateRange[0] = date1;
		dateRange[1] = date2;
		fetch(date1, date2);
	}

	useFocusEffect(
		useCallback(() => {
			fetch(dateRange[0], dateRange[1]);
		}, [])
	);

	const handleDelete = (tx) => {
		(async () => {
			try{
				const id = tx.id;
				setLoading(true);
				await Query.deleteTransaction(id);
				let h = transactions.filter(t => t.id != id);
				const budget = await Query.budgetDay(new moment(tx.created_at).format('YYYY-MM-DD'));
				budget.amount -= tx.amount;
				await Query.updateBudget(budget);
				records.find(r => r.id === budget.id).amount = budget.amount;
				setTransactions(h);
				setRecords([...records]);
			}catch(err){
				Toast.show({text: localized('error')});
				console.log(err);
			}
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
			for (let i=0; i<transactions.length; i++){
				if (transactions[i].id === tx.id){
					prev = transactions[i];
					transactions[i] = tx;
					break;
				}
			}
			tx.type = types.find(t => t.id === tx.category_id);
			// may update budget
			const deltaAmount = prev.amount - tx.amount;
			if (deltaAmount){
				let budget = await Query.budgetDay(new moment(tx.created_at).format('YYYY-MM-DD'));
				budget.amount -= deltaAmount;
				records.find(r => r.id === budget.id).amount = budget.amount;
				setRecords([...records]);
				await Query.updateBudget(budget);
			}

			setTransactions(transactions);
			setLoading(false);
		})();
	}


	return (
		<Screen>
			<Content refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetch(dateRange[0], dateRange[1])} />}>
				<Card>
					<CardItem>
						<DateRangePicker date1={dateRange[0]}
									date2={dateRange[1]}
									onSelect={handleDateSelect} />
					</CardItem>
				</Card>
				<View style={[styles.chartContainer, {backgroundColor: (theme === 'light'? 'white':'#333')}]}>
				<ScrollView horizontal
							contentContainerStyle={styles.chartScroll}>
					<BudgetLineChart budgetRecords={records} />
					</ScrollView>
				</View>
				<View style={styles.historyContainer}>
					{transactions.map(t => <Transaction
											transaction={t} onDelete={handleClickDelete} 
											onEdit={handleClickEdit} />)}
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
	chartScroll: {
		paddingLeft: 15,
		paddingBottom: 20
	},
	chartContainer: {
		marginTop: 10,
		paddingLeft: 6,
	},
	historyContainer: {
		flexDirection: 'column-reverse'
	}
})
export default BudgetHistoryScreen;