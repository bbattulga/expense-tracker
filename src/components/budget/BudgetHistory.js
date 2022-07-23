import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Text} from 'native-base';

import ThemeContext from '../../context/ThemeContext';
import Transaction from '../transaction/Transaction';


const BudgetHistory = (props) => {

	const {transactions, types} = props;
	const [data, setData] = useState([]);
	const [theme, _] = useContext(ThemeContext);

	useEffect(() => {
		setData(transactions);
	}, [transactions]);

	return (
		<View style={styles.container}>
			{transactions.map(t => <Transaction transaction={t} types={types} />)}
		</View>
		)	
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column-reverse'
	}
})

export default BudgetHistory;