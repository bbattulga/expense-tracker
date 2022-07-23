import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Text,
		Button,
		DatePicker} from 'native-base';
import moment from 'moment';

import ThemeContext from '../../context/ThemeContext';
import Database from '../../database/Database';
import {localized} from '../../localization/Localize';


const dateFormat = (d) => {
	return new moment(d).format('YYYY-MM-DD');
}

const DateRangePicker = (props) => {

	const {date1, date2, onSelect} = props;
	const [d1, setD1] = useState(date1);
	const [d2, setD2] = useState(date2);
	const [theme, _] = useContext(ThemeContext);

	useEffect(() => {
		if (!props.fetchOnMount)
			return;
	}, []);

	const handleSubmit = () => {
		if (!onSelect)
			return;
		onSelect(d1, d2);
	}

	return (
		<View style={styles.container}>
			<DatePicker defaultDate={d1}
						formatChosenDate={dateFormat}
						onDateChange={d => setD1(d)}
						textStyle={{color: theme === 'light'? '#333':'#e0e0e0'}}
						{...props} />
			<Text>-</Text>
			<DatePicker defaultDate={d2}
						formatChosenDate={dateFormat}
						textStyle={{color: theme === 'light'? '#333':'#e0e0e0'}}
						onDateChange={d => setD2(d)} />
			<Button onPress={handleSubmit}
					style={styles.submit}
					{...props}>
				<Text>{localized('show')}</Text>
			</Button>
		</View>
		)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	submit: {

	}
})

export default DateRangePicker;