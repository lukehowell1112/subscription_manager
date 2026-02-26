import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {addSubscription} from "../services/subscriptionService";

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

	function handleSubmit(e) {
		e.preventDefault();

		addSubscription({
			name: form.name,
			cost: Number(form.cost),
			cycle: form.cycle,
			billingDate: form.billingDate,
			category: form.category,
		});
		navigate("/dashboard")
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
						<label htmlFor="name">Subscription name</label>
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
						<label htmlFor="cost">Fixed cost</label>
						<input
							id="cost"
							className="input"
							type="text"
							placeholder="$67.67"
							value={form.cost}
							onChange={handleChange}
						/>
					</div>

					<div className="field">
						<label htmlFor="cycle">Billing cycle</label>
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
						<label htmlFor="last">Billing date</label>
						<input
							id="billingDate"
							className="input"
							type="text"
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
							placeholder="Entertainment, Health, Work..."
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

						<Link
							className="button-primary button-link"
							to="/dashboard"
						>
							Submit
						</Link>
					</div>
				</form>
			</section>
		</main>
	);
}
