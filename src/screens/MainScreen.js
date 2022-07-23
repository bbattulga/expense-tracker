import React, {useCallback, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Content,
		View,
		Text,
		StyleProvider} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import {clearThemeCache} from 'native-base-shoutem-theme';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';

import getTheme from '../../native-base-theme/components';
import dark from '../../native-base-theme/variables/dark';
import light from '../../native-base-theme/variables/light';
import ThemeContext from '../context/ThemeContext';

import DrawerContent from '../components/drawer/DrawerContent';
import TransactionScreen from './TransactionScreen';
import BudgetScreen from './BudgetScreen';
import TransactionTypesScreen from './TransactionTypesScreen';
import HistoryScreen from './HistoryScreen';
import StatusScreen from './StatusScreen';
import SettingsScreen from './SettingsScreen';
import {localized} from '../localization/Localize';


const Drawer = createDrawerNavigator();


export default function MainScreen(props){
	
	return (
		<Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}
			screenOptions={({route}) => ({
				drawerIcon: ({focused, color, size}) => {
					let iconName;
					if (route.name === 'Transaction'){
						iconName = 'pen-tool';
					}else if (route.name === 'Transaction types'){
						iconName = 'grid';
					}else if (route.name === 'Budget'){
						iconName = 'dollar-sign';
					}else if (route.name === 'Status'){
						iconName = 'pie-chart';
					}else if (route.name === 'History'){
						iconName = 'folder';
					}else if (route.name === 'Settings'){
						iconName = 'settings';
					}
					return <Icon name={iconName} size={size} color={color} />
				}
				})}>
			<Drawer.Screen name={'Transaction'} component={TransactionScreen} options={{title: localized('transaction')}} />
			<Drawer.Screen name={('Transaction types')} component={TransactionTypesScreen} options={{title: localized('transactionTypes')}} />
			<Drawer.Screen name={('Budget')} component={BudgetScreen} options={{title: localized('budget')}} />
			<Drawer.Screen name={('Status')} component={StatusScreen} options={{title: localized('status')}} />
			<Drawer.Screen name={('History')} component={HistoryScreen} options={{title: localized('history')}}/>
			<Drawer.Screen name={('Settings')} component={SettingsScreen} options={{title: localized('settings')}}/>
		</Drawer.Navigator>
		)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})