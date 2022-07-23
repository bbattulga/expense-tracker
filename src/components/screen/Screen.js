import React, {useContext} from 'react';
import {RefreshControl} from 'react-native';
import {Container,
		Content,
		Left,
		Body,
		Right,																																																		 
		Text} from 'native-base';							

import AppToolbar from '../toolbar/AppToolbar';
import ThemeContext from '../../context/ThemeContext';


export default function Screen(props){
	
	const [theme, _] = useContext(ThemeContext);
	
	return (
		<Container>
			{props.header? <AppToolbar />: <></>}
			{props.children}
		</Container>
		)
}
Screen.defaultProps = {
	header: true
}