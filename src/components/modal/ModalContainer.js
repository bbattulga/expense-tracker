import React, {useState, useContext} from 'react';
import {Modal, 
		View, 
		StyleSheet,
		TouchableWithoutFeedback} from 'react-native';
import {Card,
		CardItem,} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';

import ThemeContext from '../../context/ThemeContext';



const ModalContainer = (props) => {

	const {onClose} = props;
	const [theme, _] = useContext(ThemeContext);

	return (
		<Modal {...props} transparent={true}
			style={styles.modal}>
			<TouchableWithoutFeedback onPress={props.onPress}>
				<View style={styles.container}>
					<Card style={styles.card}>
						{props.children}
						<Icon name="x" size={20} color={theme === 'light'? '#333':'white'}
								onPress={onClose}
								style={styles.x} />
					</Card>	
				</View>
			</TouchableWithoutFeedback>
		</Modal>
		)
}

const styles = StyleSheet.create({
	modal: {
		
	},
	card: {
		width: '80%'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	x: {
		position: 'absolute',
		top: 5,
		right: 5
	}
});


export default ModalContainer;