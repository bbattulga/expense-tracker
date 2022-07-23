import React from 'react';
import {Modal, 
		View, 
		StyleSheet,
		TouchableWithoutFeedback} from 'react-native';

const ModalContent = (props) => {


	return (
			<TouchableWithoutFeedback>
				<>
					{props.children}
				</>
			</TouchableWithoutFeedback>
		)
}

export default ModalContent;