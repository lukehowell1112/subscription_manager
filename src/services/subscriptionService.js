const USER_KEY = "currentUser";

function requireUser() {
	const user = localStorage.getItem(USER_KEY);
	if (!user) throw new Error("No user logged in.");
	return user;
}

function subscriptionsKeyFor(user) {
	return `subscriptions:${user}`;
}

export function getSubscriptions() {
	const user = requireUser();
	const key = subscriptionsKeyFor(user);

	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
}

function saveSubscriptions(subscriptions) {
	const user = requireUser();
	const key = subscriptionsKeyFor(user);

	localStorage.setItem(key, JSON.stringify(subscriptions));
}

export function addSubscription(subscription) {
    const subscriptions = getSubscriptions();
    const newSubscription = {
        id: Date.now(),
        ...subscription,
    };

    subscriptions.push(newSubscription);
    saveSubscriptions(subscriptions);
}

export function deleteSubscription(id) {
    const subscriptions = getSubscriptions().filter(
        (sub) => sub.id !== id
    );
    saveSubscriptions(subscriptions);
}

export function updateSubscription(id, updatedData) {
    const subscriptions = getSubscriptions().map((sub) => sub.id === id ? { ...sub, ...updatedData } : sub);
    saveSubscriptions(subscriptions);
}

export function setCurrentUser(username) {
	const clean = String(username || "").trim();
	if (!clean) throw new Error("Username required.");
	localStorage.setItem(USER_KEY, clean);
}

export function getCurrentUser() {
	return localStorage.getItem(USER_KEY);
}

export function logout() {
	localStorage.removeItem(USER_KEY);
}