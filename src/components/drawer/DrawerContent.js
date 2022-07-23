import React, {useCallback} from 'react';
import {StyleSheet, 
		Dimensions,
		Image} from 'react-native';
import {DrawerItemList,
		DrawerItem,
		DrawerContentScrollView} from '@react-navigation/drawer';
import {View,
		Text} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import {localized} from '../../localization/Localize';

import Profile from '../auth/Profile';

const DrawerContent = (props) => {

	const navigation = useNavigation();
	const logout = useCallback(() => {
		(async () => {
			await AsyncStorage.setItem('user', '');
			navigation.replace('Login');
		})();
	}, []);

	return (
		<DrawerContentScrollView {...props}>
			<View style={styles.profileContainer}>
				<Profile />
			</View>
			<DrawerItemList {...props} />
			<DrawerItem label={localized('logout')} onPress={logout}/>
		</DrawerContentScrollView>
		)
}

const styles = StyleSheet.create({
	profileContainer: {
		marginBottom: 10
	}
})
export default DrawerContent;