const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('subscriptionManager');
const userCollection = db.collection('user');
const subscriptionCollection = db.collection('subscription');

(async function testConnection() {
	try {
		await db.command({ ping: 1 });
		console.log('Connected to MongoDB');
	} catch (ex) {
		console.log(`Unable to connect to database with ${url} because ${ex.message}`);
		process.exit(1);
	}
})();

function getUser(email) {
	return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
	return userCollection.findOne({ token: token });
}

function getUserById(id) {
	return userCollection.findOne({ id: id });
}

async function addUser(user) {
	await userCollection.insertOne(user);
}

async function updateUser(user) {
	await userCollection.updateOne({ id: user.id }, { $set: user });
}

async function clearUserToken(id) {
	await userCollection.updateOne({ id: id }, { $unset: { token: 1 } });
}

function getSubscriptionsByUserId(userId) {
	return subscriptionCollection.find({ userId: userId }).toArray();
}

async function addSubscription(subscription) {
	await subscriptionCollection.insertOne(subscription);
	return subscription;
}

async function updateSubscription(id, userId, updates) {
	const result = await subscriptionCollection.findOneAndUpdate(
		{ id: id, userId: userId },
		{ $set: updates },
		{ returnDocument: 'after' }
	);

	return result;
}

async function deleteSubscription(id, userId) {
	const result = await subscriptionCollection.deleteOne({ id: id, userId: userId });
	return result.deletedCount > 0;
}

module.exports = {
	getUser,
	getUserByToken,
	getUserById,
	addUser,
	updateUser,
	clearUserToken,
	getSubscriptionsByUserId,
	addSubscription,
	updateSubscription,
	deleteSubscription,
};