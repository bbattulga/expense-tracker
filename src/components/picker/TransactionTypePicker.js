import React, {useState, useCallback, useEffect, useContext} from 'react';
import Picker from './Picker2';
import {useFocusEffect} from '@react-navigation/native';

import {fetchTransactionCategories} from '../../database/query';
import ThemeContext from '../../context/ThemeContext';


const TransactionTypePicker = (props) => {

	const {onSelect} = props;
	const [selectedType, setSelectedType] = useState(null);
	const [types, setTypes] = useState([]);
	const [theme, _] = useContext(ThemeContext);

	const handleValueChange = (id) => {
		setSelectedType(id);
		if (onSelect)
			onSelect(id);
	}
	useEffect(() => {
			(async () => {
				let types = await fetchTransactionCategories();
				setTypes(types);
				setSelectedType(types[0]);
			})();
	}, []);

	useFocusEffect(
		useCallback(() => {
			(async () => {
				let types = await fetchTransactionCategories();
				setTypes(types);
				setSelectedType(types[0]);
			})();
		}, [])
	);

	return (
		<Picker selectedValue={selectedType}
				onValueChange={handleValueChange}>
			{types.map(t => <Picker.Item key={t.id} label={t.name} value={t.id} />)}
		</Picker>
		)
}

export default TransactionTypePicker;