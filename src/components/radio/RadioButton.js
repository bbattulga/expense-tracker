import React, {useState, useContext} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Radio, Text, View} from 'native-base';

import ThemeContext from '../../context/ThemeContext';


const RadioButton = (props) => {

	const {selected, text, onPress} = props;
	const [theme, _] = useContext(ThemeContext);

	const handleClick = () => {
		if (onPress)
			onPress();
	}

	return (
		<TouchableWithoutFeedback onPress={handleClick}>
			<View style={StyleSheet.flatten([styles.container, props.containerStyle])}>
				<Radio selected={selected}
						onPress={handleClick}
						style={StyleSheet.flatten([styles.radio, {color: theme==='light'?'#black':'white'}])} />
				<Text>{text}</Text>
			</View>
		</TouchableWithoutFeedback>
		)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	radio: {
		marginRight: 8
	}
});


export default RadioButton;