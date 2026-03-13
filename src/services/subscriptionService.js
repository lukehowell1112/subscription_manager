const USER_KEY = "currentUser";

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
}

export function logoutLocal() {
	localStorage.removeItem(USER_KEY);
	notifyAuthChanged();
}

export async function loginUser(username, password) {
	const response = await fetch("http://localhost:4000/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({
			email: username,
			password,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Login failed");
	}

	setCurrentUser(data.email);
	return data;
}

export async function signupUser(username, password) {
	const response = await fetch("http://localhost:4000/api/auth/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({
			email: username,
			password,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Signup failed");
	}

	setCurrentUser(data.email);
	return data;
}

export async function logoutUser() {
	const response = await fetch("http://localhost:4000/api/auth/logout", {
		method: "DELETE",
		credentials: "include",
	});

	logoutLocal();

	if (!response.ok) {
		throw new Error("Logout failed");
	}
}