import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export function Add() {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		name: "",
		cost: "",
		cycle: "",
		billingDate: "",
		category: "",
	});

	function handleChange(e) {
		const {id, value} = e.target;
		setForm((prev) => ({...prev, [id]: value,}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		console.log("Submit clicked");

		const newSubscription = {
			name: form.name,
			cost: Number(form.cost),
			cycle: form.cycle,
			billingDate: form.billingDate,
			category: form.category,
		};

		console.log("Sending:", newSubscription);

		try {
			const response = await fetch("/api/subscriptions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(newSubscription),
			});

			console.log("Response received:", response.status);

			if (!response.ok) {
				throw new Error("Failed to add subscription");
			}

			const savedSubscription = await response.json();
			console.log("Saved subscription:", savedSubscription);

			navigate("/dashboard");
		} catch (error) {
			console.error("Error adding subscription:", error);
		}
}

	return (
		<main className="container main-wrap">
			<div className="page-head">
				<div>
					<h2 className="page-title">Add Subscription</h2>
					<p className="page-subtitle">
						Create a new recurring item for your dashboard.
					</p>
				</div>
			</div>

			<section className="card form-card">
				<form className="form-grid" onSubmit={handleSubmit}>
					<div className="field">
						<label htmlFor="name">Subscription Name</label>
						<input
							id="name"
							className="input"
							type="text"
							placeholder="Disney+, Gym, Spotify..."
							value={form.name}
							onChange={handleChange}
						/>
					</div>

					<div className="field">
						<label htmlFor="cost">Fixed Cost</label>
						<input
							id="cost"
							className="input"
							type="number"
							step="0.01"
							placeholder="67.67"
							value={form.cost}
							onChange={handleChange}
						/>
					</div>

					<div className="field">
						<label htmlFor="cycle">Billing Cycle</label>
						<input
							id="cycle"
							className="input"
							type="text"
							placeholder="Monthly, Yearly, Weekly..."
							value={form.cycle}
							onChange={handleChange}
						/>
					</div>

					<div className="field">
						<label htmlFor="billingDate">Next Billing Date</label>
						<input
							id="billingDate"
							className="input"
							type="date"
							placeholder="Wenduary 56th, 3005"
							value={form.billingDate}
							onChange={handleChange}
						/>
					</div>

					<div className="field">
						<label htmlFor="category">Category</label>
						<input
							id="category"
							className="input"
							type="text"
							placeholder="Entertainment, Health, Storage..."
							value={form.category}
							onChange={handleChange}
						/>
					</div>

					<div className="button-row field-wide">
						<Link
							className="button-secondary button-link"
							to="/dashboard"
						>
							Return to Dashboard
						</Link>

						<button className="button-primary" type="submit">
							Submit
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}
