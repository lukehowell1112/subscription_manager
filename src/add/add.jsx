import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../forms.css";

export function Add() {
	const navigate = useNavigate();

	const cycleOptions = ["monthly", "yearly", "weekly"];

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

		const newSubscription = {
			name: form.name,
			cost: Number(form.cost),
			cycle: form.cycle,
			billingDate: form.billingDate,
			category: form.category,
		};

		try {
			const response = await fetch("/api/subscriptions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(newSubscription),
			});

			if (!response.ok) {
				throw new Error("Failed to add subscription");
			}

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
						<select
							id="cycle"
							className="input select-input"
							value={form.cycle}
							onChange={handleChange}
						>
							
							<option value="">Select a billing cycle</option>

								{cycleOptions.map((option) => (
									<option key={option} value={option}>
										{option.charAt(0).toUpperCase() + option.slice(1)}
									</option>
								))}
						</select>
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
						<select
							id="category"
							className="input select-input"
							value={form.category}
							onChange={handleChange}
						>
							<option value="">Select a category</option>
							<option value="entertainment">Entertainment</option>
							<option value="storage">Storage</option>
							<option value="work">Work</option>
							<option value="health">Health</option>
							<option value="school">School</option>
							<option value="other">Other</option>
						</select>
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
