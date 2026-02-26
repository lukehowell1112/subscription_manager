import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {setCurrentUser} from "../services/subscriptionService";

export function Login() {
	const navigate = useNavigate();

	const[username, setUsername] = useState("");
	const[password, setPassword] = useState("");

	function handleSubmit(e) {
		e.preventDefault();

		if(!username.trim()) {
			alert("Please enter a username.")
			return;
		}

		setCurrentUser(username);
		navigate("/dashboard");
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

					<form>
						<div className="field">
							<label htmlFor="username">Username:</label>
							<input
								id="username"
								className="input"
								type="text"
								placeholder="Enter your username"
							/>
						</div>

						<div className="field">
							<label htmlFor="password">Password:</label>
							<input
								id="password"
								className="input"
								type="password"
								placeholder="Enter your password"
							/>
						</div>

						<div className="button-row">
							<Link className="button-primary button-link" to="/dashboard">
								Login
							</Link>

							<Link className="button-secondary button-link" to="/dashboard">
								Sign Up
							</Link>
						</div>
					</form>
				</div>
			</section>
		</main>
	);
}
