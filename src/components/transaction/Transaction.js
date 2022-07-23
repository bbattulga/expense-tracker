import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Form,
		Item,
		Label,
		Button,
		Text,
		Input,
		Card,
		CardItem,
		Picker} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';

import ThemeContext from '../../context/ThemeContext';
import {localized} from '../../localization/Localize';

const handleDelete = (props, tx) => {
	if (props.onDelete){
		props.onDelete(tx);
	}
}

const handleEdit = (props, tx) => {
	if (props.onEdit){
		props.onEdit(tx);
	}
}

export default function Transaction(props){
	const {transaction} = props;
	const [theme, _] = useContext(ThemeContext);
	const h = transaction;
	const color = theme === 'light'? '#333': '#e0e0e0';
	const toolIconStyle = {marginLeft: 8, color};
	return (
		<Card key={h.id}>
			<CardItem>
				<View>
					<Text>{h.amount}</Text>
					<Text>{h.type.name}</Text>
					<Text>{h.description}</Text>
					<Text style={styles.date}>{h.created_at}</Text>
				</View>
			</CardItem>
			<View style={styles.del}>
				<Icon name="edit" size={16} color={'white'}
						onPress={() => handleEdit(props, h)}
					 style={toolIconStyle} />
				<Icon onPress={() => handleDelete(props, h)} style={toolIconStyle} name="x" size={16} color={'white'}/>
			</View>
		</Card>
	)
}

const styles = StyleSheet.create({
	del: {
		position: 'absolute',
		flexDirection: 'row',
		top: 7,
		right: 7
	},
	date: {
		color: 'grey',
		fontSize: 12
	}
});