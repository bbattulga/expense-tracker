import React, {useState, useCallback, useContext, useEffect} from 'react';
import {StyleSheet, ScrollView, Alert, RefreshControl} from 'react-native';
import {View,
		Content,
		Form,
		Label,
		Item,
		Input,
		Card,
		CardItem,
		Button,
		Tabs,
		Tab,
		Fab,
		Text,
		Toast} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import Screen from '../components/screen/Screen';
import ThemeContext from '../context/ThemeContext';
import * as Query from '../database/query';
import ModalContainer from '../components/modal/ModalContainer';
import ModalContent from '../components/modal/ModalContent';
import Picker from '../components/picker/Picker2';
import {localized} from '../localization/Localize';


const TransactionTypesScreen = (props) => {

	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [mergeId, setMergeId] = useState(null);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [types, setTypes] = useState([]);
	const [selectedType, setSelectedType] = useState(null);
	const [typeName, setTypeName] = useState('');
	const [theme, _] = useContext(ThemeContext);

	const fetchTypes = async () => {
		setLoading(true);
		let t = await Query.fetchTransactionCategories(false);
		setTypes(t);
		setLoading(false);
	}
	useFocusEffect(
		useCallback(() => {
			fetchTypes();
		}, [])
	);

	const handleClickFab = () => {
		setShowModal(true);
	}

	const handleSubmitAdd = () => {
		(async () => {
			try{
				let txType = {id: null, name: typeName};
				let id = await Query.createTransactionCategory(txType);
				setTypes([...types, txType]);
				txType.id = id;
				setShowModal(false);
				setTypeName('');
			}catch(err){
				console.log(err);
			}
		})();
	}

	const handleDelete = (id) => {
		(async () => {
			try{
				// true for force delete
				const deletedTx = await Query.deleteTransactionCategory(id, true);
				setTypes(types.filter(t => t.id != id));
				Toast.show({text: localized('deletedTransactionCount')(deletedTx), duration: 2500});
			}catch(err){
				console.log(err);
			}
		})();
	}

	const handleClickDelete = (id) => {
		const title = localized('makeSureDeleteTransactionType');
		const name = types.find(t => t.id == id).name;
		const body = localized('deleteTransactionTypeDesc')(name);
		
		Alert.alert(title, body, [
				{text: localized('cancel')},
				{text: localized('yes'), onPress: () => handleDelete(id)}
			])
	}


	const handleClickEdit = (type) => {
		setSelectedType({...type});
		setMergeId(type.id);
		setShowAdvanced(false);
		setShowEditModal(true);
	}

	const handleMerge = () => {
		(async () => {
			setLoading(true);	
			const sql = 'UPDATE transactions SET category_id=? WHERE category_id=?';
			const args = [mergeId, selectedType.id];
			const result = await Query.executeSql(sql, args);
			setShowAdvanced(false);
			setShowEditModal(false);
			setLoading(false);
			Toast.show({text: localized('updatedTransactions')(result.rowsAffected), duration: 2500});
		})();
	}
	const handleEdit = () => {
		(async () => {

			await Query.updateTransactionCategory(selectedType);

			// no merge operation?
			if (selectedType.id === mergeId){
				types.find(t => t.id === selectedType.id).name = selectedType.name;
				setTypes(types);
				setShowEditModal(false);
				setShowAdvanced(false);
				return;
			}

			// merge
			const title = localized('mergeTransactions');
			const body = localized('mergeWarning')(selectedType.name, types.find(t=>t.id===mergeId).name);
			Alert.alert(title, body, [{text: localized('cancel')}, {text: 'Ok', onPress: handleMerge}])
		})();
	}

	const renderType = (type) => {
		return (
			<Card key={type.id}>
				<CardItem>
					<View style={styles.row}>
						<Text>{type.name}</Text>
						<View style={styles.crudContainer}>
							<Icon 
								onPress={() => handleClickEdit(type)}
								name="edit"
								color={theme === 'light'? '#444': '#e0e0e0'}
								size={18}
								style={styles.crudItem} />
							<Icon onPress={() => handleClickDelete(type.id)}
								name="trash"
								color={theme === 'light'? '#444': '#e0e0e0'}
								size={18}
								style={styles.crudItem} />
						</View>
					</View>
				</CardItem>
			</Card>
			)
	}

	const renderAdvancedSettings = () => {
		if (!showAdvanced)
			return <></>
		return (
			<Item>
				<Label>{localized('mergeTo')}</Label>
				<Picker selectedValue={mergeId}
						onValueChange={(id) => setMergeId(id)}>
					{types.map(t => <Picker.Item key={t.id} value={t.id} label={t.name} />)}
				</Picker>
			</Item>
			)
	}

	return (
		<Screen>
			<Content contentContainerStyle={styles.container}
					refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTypes} />}>
				<View style={styles.typesContainer}>
					{types.map(t => renderType(t))}
				</View>
			<Fab
	            active={true}
	            direction="up"
	            containerStyle={{ }}
	            style={{ backgroundColor: 'teal' }}
	            position="bottomRight"
	            onPress={handleClickFab}>
	            <Icon name="plus" color="teal"/>
            </Fab>
            <ModalContainer onPress={() => setShowModal(false)} visible={showModal}
            				onClose={() => setShowModal(false)}>
            	<ModalContent>
            		<>
        			<CardItem header>
        				<Text>{localized('enterTransactionTypeName')}</Text>
        			</CardItem>
            		<CardItem>
            			<Form style={styles.form}>
            				<Item>
            					<Input autoFocus
            						value={typeName}
            						onChangeText={setTypeName}/>
            				</Item>
            			</Form>
            		</CardItem>
            		<CardItem footer
            			style={styles.submit}>
            			<Button onPress={handleSubmitAdd}>
            				<Text>{localized('add')}</Text>
            			</Button>
            		</CardItem>
            	</>
            	</ModalContent>
            </ModalContainer>
            <ModalContainer onPress={() => setShowEditModal(false)} visible={showEditModal}
            				onClose={() => setShowEditModal(false)}>
            	<ModalContent>
        			<CardItem header>
        				<Text>{localized('editTransactionType')}</Text>
        			</CardItem>
        			<CardItem>
        				<Form style={styles.form}>
        					<Item>
        						<Label>name</Label>
        						<Input value={selectedType?.name}
        							onChangeText={(name) => setSelectedType({...selectedType, name})}/>
        					</Item>
        					<Item style={{borderColor: 'transparent', marginTop: 30}}>
        						<Button small rounded
        								onPress={() => setShowAdvanced(!showAdvanced)}>
            						<Text>{showAdvanced? localized('close'):localized('advanced')}</Text>
            					</Button>
        					</Item>
        					{renderAdvancedSettings()}
        				</Form>
        			</CardItem>
        			<CardItem footer style={{alignSelf: 'flex-end'}}>
        				<Button onPress={handleEdit}>
        					<Text>{localized('save')}</Text>
        				</Button>
        			</CardItem>
            	</ModalContent>
            </ModalContainer>
            </Content>
		</Screen>
		)
}

export default TransactionTypesScreen;


const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	typesContainer: {
		flexDirection: 'column-reverse',
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	form: {
		flex: 1
	},
	modalContent: {
		width: '80%', 
		maxWidth: 300
	},
	submit: {
		alignSelf: 'flex-end'
	},
	crudContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	crudItem: {
		marginLeft: 10
	}
})