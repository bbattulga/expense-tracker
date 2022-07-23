import React, {useContext} from 'react';
import {Picker} from 'native-base';

import ThemeContext from '../../context/ThemeContext';


const Picker2 = (props) => {

	const [theme, _] = useContext(ThemeContext);

	return (
		<Picker style={{color: theme === 'light'? '#333':'#e0e0e0'}}
				{...props}>
				{props.children}
		</Picker>
		)
}

Picker2.Item = (props) => {
	const [theme, _] = useContext(ThemeContext);
	return (
		<Picker.Item {...props} style={{color: theme === 'light'? '#333':'#e0e0e0'}}>
			{props.children}
		</Picker.Item>
		)
}

export default Picker2;