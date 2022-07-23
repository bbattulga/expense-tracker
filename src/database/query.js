import * as SQLite from 'expo-sqlite';
import moment from 'moment';
import Database from './Database';
import * as crypto from 'expo-crypto';


// TABLES
/*
table example
// users table
	{name: 'users', columns: [
		{name: 'id', type:'INTEGER PRIMARY KEY'},
		{name: 'first_name', type: 'VARCHAR(25)'},
		{name: 'last_name', type: 'VARCHAR(25)'},
		{name: 'email', type: 'VARCHAR(45)'},
		{name: 'password', type: 'VARCHAR(100)'},
	]},
*/

const _tx = (sql, args, newDbInstance=false) => {
	return new Promise((resolve, reject) => {

		const success = (tx, resultSet) => {
			resolve(resultSet);
		}
		const error = (tx, error) => {
			reject(error);
		}

		let db;
		if (newDbInstance)
			db = Database.newInstance();
		else
			db = Database.getInstance();
		db.transaction(tx => {
			tx.executeSql(sql, args, success, error);
		});
	})
}

// may some validation
export const executeSql = async (sql, args) =>{
	const result = await _tx(sql, args);
	return result;
}

const _hash = async (pwd) => {
	const hash = await crypto.digestStringAsync(
	        crypto.CryptoDigestAlgorithm.SHA256,
	        pwd
	      );
	return hash;
}

export const dropTable = (tableName) => {
	return new Promise((resolve, reject) => {
		let sql = `DROP TABLE IF EXISTS ${tableName}`;
		Database.getInstance().transaction(tx => {
			tx.executeSql(sql, null, (tx, result) => resolve(true), (tx, err) => reject(err));
		}, (err) => reject(err));
	});
}

const timeStamps = 'created_at DATETIME default CURRENT_TIMESTAMP,' + 
					'updated_at DATETIME default CURRENT_TIMESTAMP';

export const createTable = (table) => {
	return new Promise((resolve, reject) => {
		let sql = `CREATE TABLE IF NOT EXISTS ${table.name} (`;
		for (let i = 0; i<table.columns.length; i++){
			let column = table.columns[i];
			sql += `${column.name} ${column.type},`;
		}
		sql += `${timeStamps})`;
		Database.getInstance().transaction(tx => {
			tx.executeSql(sql, null, (tx, result) => resolve(true), (tx, error) => reject(error));
		}, (error) => reject(error));
	});
}

// AUTH
/*
let user = {
	first_name.
	last_name,
	email,
	password
}
*/

export const fetchUsers = async () => {
	const sql = 'SELECT * FROM users';
	const {rows: {_array}} = await _tx(sql);
	return _array;
}

export const login = async (email, password) => {
	const sql = 'SELECT * FROM users WHERE email=? AND password=? LIMIT 1';
	const hash = await _hash(password);
	const args = [email, hash];
	const {rows: {_array}} = await _tx(sql, args);
	return _array[0];
}

export const signup = async (user) => {
	const u = user;
	const sql = 'INSERT INTO users(first_name, last_name, email, password) VALUES(?, ?, ?, ?)';

	const exists = await login(user.email, user.password);
	// check return id
	if (exists)
		return 0;

	const hash = await _hash(user.password);
	const args = [u.first_name, u.last_name, u.email, hash];
	let result = await _tx(sql, args);
	return result.insertId;
}

export const updateUser = async (user) => {
	const u = user;
	const hash = await _hash(user.password);
	const sql = 'UPDATE users SET first_name=?, last_name=?, email=?, password=?';
	const args = [u.first_name, u.last_name, u.email, hash];
	const result = await _tx(sql, args);
	return result.rowsAffected;
}

export const deleteUser = async (id) => {
	const sql = 'DELETE * FROM users WHERE id=?';
	const result = await _tx(sql, [id]);
	return result.rowsAffected;
}

// TRANSACTION CATEGORIES
export const createTransactionCategory = async (ec) => {
	const sql = 'INSERT INTO transaction_categories(name) VALUES(?)';
	const result = await _tx(sql, [ec.name]);
	return result.insertId;
}

export const updateTransactionCategory = async (et) => {
	const sql = 'UPDATE transaction_categories SET name=? WHERE id=?';
	const result = await _tx(sql, [et.name, et.id]);
	return result.rowsAffected;
}

export const deleteTransactionCategory = async (id) => {
	const result = await _tx('DELETE FROM transaction_categories WHERE id=?', [id]);
	const deletedTx = await _tx('DELETE FROM transactions WHERE category_id=?', [id]);
	return deletedTx.rowsAffected;
}

export const fetchTransactionCategories = async (withTrashed=true) => {
	let sql = 'SELECT * FROM transaction_categories';
	if (!withTrashed)
		sql += ` WHERE deleted_at IS NULL`;
	const {rows: {_array}} = await _tx(sql);
	return _array;
}

// TRANSACTIONS
export const createTransaction = async (transaction) => {
	const tx = transaction;
	const sql = 'INSERT INTO transactions(amount, category_id, description, created_at) VALUES(?, ?, ?, ?)';
	const resultSet = await _tx(sql, [tx.amount, tx.category_id, tx.description, tx.created_at]);
	return resultSet.insertId;
}

export const updateTransaction = async (transaction) => {
	const tx = transaction;
	const sql = 'UPDATE transactions SET amount=?, category_id=?, description=?, created_at=? WHERE id=?';
	const args = [tx.amount, tx.category_id, tx.description, tx.created_at, tx.id];
	const result = await _tx(sql, args);
	return result.rowsAffected;
}

const _fetchTransactions = async (conditions, args) => {
	const sql = `SELECT * FROM transactions WHERE ${conditions}`;
	const {rows: {_array}} = await _tx(sql, args);
	const types = await fetchTransactionCategories();
	for (let i=0; i<_array.length; i++){
		let tx = _array[i];
		tx.type = types.find(t => t.id === tx.category_id)
	}
	return _array;
}

export const fetchTransactions = async (date1, date2) => {
	const conditions = 'created_at>=? AND created_at<=?';
	const args = [date1, date2];
	const _array = await _fetchTransactions(conditions, args);
	const types = await fetchTransactionCategories();
	for (let i=0; i<_array.length; i++){
		let tx = _array[i];
		tx.type = types.find(t => t.id === tx.category_id)
	}
	return _array;
}

export const fetchOutcomes = async (date1, date2) => {
	const conditions = 'amount<0 AND created_at>=? AND created_at<=?';
	const args = [date1, date2];
	const txs = await _fetchTransactions(conditions, args);
	return txs;
}

export const fetchIncomes = async (date1, date2) => {
	const conditions = 'amount>-1 AND created_at>=? AND created_at<=?';
	const args = [date1, date2];
	const txs = await _fetchTransactions(conditions, args);
	return txs;
}

export const queryTransactions = async (condition, args) => {
	const sql = `SELECT * FROM transactions WHERE ${condition}`;
	const {rows: {_array}} = await _tx(sql, args);
	return _array;
}

export const deleteTransaction = async (id) => {
	const sql = 'DELETE FROM transactions WHERE id=?';
	const resultSet = await _tx(sql, [id]);
	return resultSet.rowsAffected;
}

// BUDGET
export const fetchBudgetById = async (id) => {
	const sql = 'SELECT * FROM budget_records WHERE id=?';
	const result = await _tx(sql, [id]);
	return result[0];
}

export const fetchBudgetByDate = async (date) => {
	const sql = 'SELECT * FROM budget_records WHERE date=? LIMIT 1';
	const {rows: {_array}} = await _tx(sql, [date]);
	return _array[0];
}

export const fetchBudgetRecords = async (date1, date2) => {
	let records = [];

	// last non-null budget
	const start = date1;

	while (date1 < date2){
		let budget = await budgetDay(date1);
		records.push(budget);
		date1 = new moment(date1).add(1, 'days').format('YYYY-MM-DD');
	}
	return records;
}

export const createBudgetRecord = async (budgetRecord) => {
	const sql = 'INSERT INTO budget_records(amount, date) VALUES(?, ?)';
	const args = [budgetRecord.amount, budgetRecord.date];
	const result = await _tx(sql, args);
	return result.insertId;
}

export const updateBudget = async (budget) => {
	const sql = `UPDATE budget_records SET amount=? WHERE id=? LIMIT 1`;
	const args = [budget.amount, budget.id];
	const result = await _tx(sql, args);
	return result.rowsAffected;
}

export const lastBudget = async () => {
	const sql = 'SELECT * FROM budget_records ORDER BY id DESC LIMIT 1';
	const result = await _tx(sql, []);
	const {rows: {_array}} = result;
	return _array[0];
}

export const budgetDay = async (date, createIfNull = true) => {
	let budget = await fetchBudgetByDate(date);
	if (budget){
		return budget;
	}
	if (!createIfNull)
		return null;
	
	budget = {
		amount: 0,
		date: date
	}
	let lb = await lastBudget();
	if (lb && lb.date <= date){
		budget.amount = lb.amount;
	}
	budget.id = await createBudgetRecord(budget);
	return budget;
}

export const budgetToday = async (createIfNull = true) => {
	const todayStr = new moment().format('YYYY-MM-DD');
	let budget = await budgetDay(todayStr);
	if (budget){
		return budget;
	}
	// create budget
	budget = await lastBudget();
	if (!budget){
		budget = {
			amount: 0,
			date: todayStr
		}
		budget.id = await createBudgetRecord(budget);
		return budget;
	}
	budget.date = todayStr;
	budget.id = await createBudgetRecord(budget);
	return budget;
}