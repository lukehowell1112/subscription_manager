import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {setCurrentUser, logout, getCurrentUser} from "../services/subscriptionService";

export function Login() {
	const currentUser = getCurrentUser();
	const navigate = useNavigate();

	const[username, setUsername] = useState("");
	const[password, setPassword] = useState("");

	function handleLogout() {
		logout()
		window.location.reload();
		navigate("/");
	}

	function handleSubmit(e) {
		e.preventDefault();

		if(!username.trim()) {
			alert("Please enter a username.")
			return;
		}

		setCurrentUser(username);
		navigate("/dashboard");
		window.location.reload();
	}
	return (
		<main className="container main-wrap">
			<section className="blah">
				<div className="blah-text">
					<h2>The Smarter Way to Track Subscriptions</h2>
					<p>Track recurring costs, see monthly totals, and stay in control.</p>
				</div>

				<div className="card login-card">
					<h3>Login</h3>

					<form onSubmit={handleSubmit}>
						<div className="field">
							<label htmlFor="username">Username:</label>
							<input
								id="username"
								className="input"
								type="text"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>

						<div className="field">
							<label htmlFor="password">Password:</label>
							<input
								id="password"
								className="input"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<div className="button-row">
							{currentUser ? (
								<>
									<p>
										Logged in as <strong>{currentUser}</strong>
									</p>

									<button
										className="button-danger"
										type="button"
										onClick={handleLogout}
									>
										Logout
									</button>
								</>
							) : (
								<>
									<button className="button-primary" type="submit">
										Login
									</button>

									<button
										className="button-secondary"
										type="button"
										onClick={() => alert("Sign Up coming soon. For now, just enter a username.")}
									>
										Sign Up
									</button>
								</>
							)}
						</div>
					</form>
				</div>
			</section>
		</main>
	);
}
