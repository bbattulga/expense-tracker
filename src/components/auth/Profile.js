import React, {useState, useEffect, useCallback, useContext} from 'react';
import {StyleSheet, 
		Image,
		Dimensions,
		View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import {Text, Spinner} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import ThemeContext from '../../context/ThemeContext';


const screenHeight = Dimensions.get('window').height;

const Profile = (props) => {

	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();
	const [user, setUser] = useState(null);
	const theme = useContext(ThemeContext);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const userjson = await AsyncStorage.getItem('user');
			const user = JSON.parse(userjson);
			setUser(user);
			setLoading(false);
		})();
	}, []);

	const editUser = useCallback(() => {
		navigation.navigate('EditUser');
	}, [navigation]);

	if (loading){
		return (
			<View style={styles.container}>
				<Spinner />
			</View>
			)
	}
	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Icon name="user" size={48} color={theme === 'dark'?'#e0e0e0':'#333'} />
			</View>
			<View style={styles.detailContainer}>
				<Text>{user?.last_name}</Text>
				<Text>{user?.first_name}</Text>
				<Text>{user?.email}</Text>
			</View>
			<View style={styles.editContainer}>
				<Icon onPress={editUser}
					name="edit" size={24} color={theme === 'dark'?'#e0e0e0':'#333'} />
			</View>
		</View>
		)
}
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginLeft: 10
	},
	imageContainer: {
		
		borderRadius: 30,
		padding: 10
	},
	detailContainer: {
		flex: 1,
		marginLeft: 20
	},
	editContainer: {
		padding: 3
	}
})

export default Profile;