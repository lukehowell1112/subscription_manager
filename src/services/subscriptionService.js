const USER_KEY = "currentUser";

function requireUser() {
	const user = localStorage.getItem(USER_KEY);
	if (!user) throw new Error("No user logged in.");
	return user;
}

function subscriptionsKeyFor(user) {
	return `subscriptions:${user}`;
}

function saveSubscriptions(subscriptions) {
	const user = requireUser();
	const key = subscriptionsKeyFor(user);

	localStorage.setItem(key, JSON.stringify(subscriptions));
}

export function updateSubscription(id, updatedData) {
    const subscriptions = getSubscriptions().map((sub) => sub.id === id ? { ...sub, ...updatedData } : sub);
    saveSubscriptions(subscriptions);
}

function notifyAuthChanged() {
	window.dispatchEvent(new Event("authchanged"));
}

export function setCurrentUser(username) {
	const clean = String(username || "").trim();
	if (!clean) throw new Error("Username required.");
	localStorage.setItem(USER_KEY, clean);
    notifyAuthChanged();
}

export function getCurrentUser() {
	return localStorage.getItem(USER_KEY);
    notifyAuthChanged();
}

export function logout() {
	localStorage.removeItem(USER_KEY);
    notifyAuthChanged();
}