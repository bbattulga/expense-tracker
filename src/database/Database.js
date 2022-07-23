import * as SQLite from 'expo-sqlite';


const name = 'database.db';
const version = 1;

const db = SQLite.openDatabase(name, version, 'desc', 8000);

export default class Database{

	static getInstance(){
		return db;
	}

	static newInstance(){
		return SQLite.openDatabase(name, version);
	}
}