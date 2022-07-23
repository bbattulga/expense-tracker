import * as SQLite from 'expo-sqlite';
import {createTable, dropTable} from './query';

const tables = [

	// users table
	{name: 'users', columns: [
		{name: 'id', type:'INTEGER PRIMARY KEY'},
		{name: 'first_name', type: 'VARCHAR(25)'},
		{name: 'last_name', type: 'VARCHAR(25)'},
		{name: 'email', type: 'VARCHAR(45)'},
		{name: 'password', type: 'VARCHAR(100)'},
	]},

	// transaction categories
	{name: 'transaction_categories', columns: [
		{name: 'id', type:'INTEGER PRIMARY KEY'},
		{name: 'name', type: 'VARCHAR(25)'},
		{name: 'deleted_at', type: 'DATETIME DEFAULT NULL'}
	]},

	// transactions
	{name: 'transactions', columns: [
		{name: 'id', type:'INTEGER PRIMARY KEY'},
		{name: 'category_id', type: 'INTEGER'},
		{name: 'amount', type: 'INTEGER'},
		{name: 'description', type: 'VARCHAR(100)'}
	]},

	// budget records
	{name: 'budget_records', columns: [
		{name: 'id', type:'INTEGER PRIMARY KEY'},
		{name: 'amount', type: 'INTEGER'},
		{name: 'date', type: 'DATETIME'}
	]},
];


export const dropTables = () => {
	return new Promise((resolve, reject) => {
		(async () => {
			for (let i=0; i<tables.length; i++){
				try{
					await dropTable(tables[i].name);
					console.log(`dropped ${tables.[i].name} table`);
				}catch(err){
					reject(err);
				}
			}
			resolve(true);
		})();
	});
}

export const createTables = () => {
	return new Promise((resolve, reject) => {
		(async () => {
			for (let i=0; i<tables.length; i++){
				let table = tables[i];
				try{
					await createTable(table);
					console.log(`created ${table.name} table`);
				}catch(err){
					reject(err);
				}
			}
			resolve(true);
		})();
	});
}

export const refreshTables = () => {
	return new Promise((resolve, reject) => {
		(async () => {

			try{
				await dropTables();
			}catch(err){
				console.log('error when dropping tables');
				console.log(err);
				reject(err);
			}
			
			try{
				await createTables();
			}catch(err){
				console.log('error when creating tables');
				console.log(err);
				reject(err);
			}
			resolve(true);
		})();
	})
}