import React, {useContext} from 'react';
import {DatePicker} from 'native-base';
import moment from 'moment';

import ThemeContext from '../../context/ThemeContext';


const dateFormat = (d) => {
	return new moment(d).format('YYYY-MM-DD');
}

const DatePicker2 = (props) => {

	const [theme, _] =useContext(ThemeContext);
	return (
		<DatePicker formatChosenDate={dateFormat}
					textStyle={{color: theme === 'light'? '#333':'#e0e0e0'}} 
				  {...props}/>
		)
}

export default DatePicker2;