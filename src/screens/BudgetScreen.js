import React from 'react';
import {StyleSheet} from 'react-native';
import {View,
		Text} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import Screen from '../components/screen/Screen';
import BudgetChargeScreen from './BudgetChargeScreen';
import BudgetHistoryScreen from './BudgetHistoryScreen';
import {localized} from '../localization/Localize';


const Tab = createBottomTabNavigator();

const BudgetScreen = (props) => {
	
	return (
		<Tab.Navigator>
			<Tab.Screen name="charge" component={BudgetChargeScreen}
					options={{
						title: localized('charge'),
							tabBarIcon: ({focused, size, color}) => <Icon name="dollar-sign" size={size} color={color} /> 
						}}/>
			<Tab.Screen name="history" component={BudgetHistoryScreen}
						options={{
							title: localized('history'),
							tabBarIcon: ({focused, size, color}) => <Icon name="trending-up" size={size} color={color} /> 
						}} />
		</Tab.Navigator>
		)
}

export default BudgetScreen;