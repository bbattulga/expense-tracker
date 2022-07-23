import Database from '../Database';
import faker from 'faker';
import moment from 'moment';
import * as crypto from 'expo-crypto';

import * as Query from '../query';

export const seedUser = async () => {
	const sql = 'INSERT INTO users(first_name, last_name, email, password) VALUES(?, ?, ?, ?)';
	const hash = await crypto.digestStringAsync(
		        crypto.CryptoDigestAlgorithm.SHA256,
		        'admin'
		      );
	const args = ['batt', 'bad', 'batt@mail.com', hash];
	const result = await Query.executeSql(sql, args);
	return result.insertId;
}

export const seedTransactionTypes = async () => {
	let range = {min: 5, max: 8};
	const txTypes = new Array(faker.random.number(range)).fill(0).map(e => faker.name.firstName());

	for (let i=0; i<txTypes.length; i++){
		let txType = txTypes[i];
		try{
			await Query.createTransactionCategory({name: txType});
		}catch(err){
			console.log('error when seeding transaction types');
			console.log(err);
		}
	}
	console.log('seeded transaction types');
	console.log(txTypes);
}

const seedTransactions = async (date1, date2) => {

	let d1 = new moment(date1).format('YYYY-MM-DD');
	let d2 = new moment(date2).format('YYYY-MM-DD');
	console.log(date1, date2);
	let deltaDays = date2.diff(date1, 'days');
	const txMax = 5;
	const budgetMax = 3*Math.pow(10, 5);
	const avg = budgetMax*0.01;
	let budget = await Query.budgetDay(d1);
	budget.amount = budgetMax;
	await Query.updateBudget(budget);

	let types = await Query.fetchTransactionCategories();
	console.log('SEED TRANSACTIONS');
	while (d1 <= d2){
		budget = await Query.budgetDay(d1);
		let txCount = faker.random.number({min: 1, max:txMax});
		
		for (let i=0; i<txCount; i++){
			let tx = {
				amount: -parseInt(Math.abs(50+avg*Math.random())),
				category_id: types[parseInt(types.length*Math.random())].id,
				description: faker.random.words(6),
				created_at: new moment(d1).format('YYYY-MM-DD 12:00:00')
			}
			console.log(tx);
			await Query.createTransaction(tx);
			// tx amount is negative
			budget.amount += tx.amount;
			await Query.updateBudget(budget);
		}
		d1 = new moment(d1).add(1, 'days').format('YYYY-MM-DD');
	}
	console.log(budgetMax);	
	return true;
}

export const seed = async (date1, date2) => {

	if (!date1)
		date1 = new moment().subtract(14, 'Days');
	if (!date2)
		date2 = new moment();
	await seedTransactionTypes();
	await seedTransactions(date1, date2);
	return true;
}