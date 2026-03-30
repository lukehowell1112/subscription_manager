import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../forms.css";

export function Edit_Form() {
	const navigate = useNavigate();

	const cycleOptions = ["monthly", "yearly", "weekly"];

	const [selectedId, setSelectedId] = useState(null);
	const [form, setForm] = useState({
		name: "",
		cost: "",
		cycle: "",
		billingDate: "",
		category: "",
	});

	useEffect(() => {
		const raw = sessionStorage.getItem("editSelectedId");
		const id = raw ? raw : null;
		setSelectedId(id);

		if (id == null) {
			alert("No subscription selected to edit.");
			navigate("/edit_sub");
			return;
		}

		fetch("/api/subscriptions", {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((subs) => {
				const sub = subs.find((s) => s.id === id);

				if (!sub) {
					alert("Could not find that subscription.");
					navigate("/dashboard");
					return;
				}

				setForm({
					name: sub.name ?? "",
					cost: String(sub.cost ?? ""),
					cycle: sub.cycle ? sub.cycle.toLowerCase() : "",
					billingDate: sub.billingDate ? sub.billingDate.split("T")[0] : "",
					category: sub.category ?? "",
				});
			})
			.catch((err) => {
				console.error("Error fetching subscriptions:", err);
				alert("Failed to load subscription.");
				navigate("/dashboard");
			});
	}, [navigate]);

	function handleChange(e) {
		const { id, value } = e.target;
		setForm((prev) => ({ ...prev, [id]: value }));
	}

	function parseCost(costText) {
		const cleaned = String(costText).replace(/[^0-9.]/g, "");
		const num = Number(cleaned);
		return Number.isFinite(num) ? num : NaN;
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (selectedId == null) return;

		const costNumber = parseCost(form.cost);

		if (!form.name.trim()) {
			alert("Please enter a subscription name.");
			return;
		}

		if (!Number.isFinite(costNumber)) {
			alert("Please enter a valid cost (example: 9.99).");
			return;
		}

		try {
			const response = await fetch(`/api/subscriptions/${selectedId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					name: form.name.trim(),
					cost: costNumber,
					cycle: form.cycle.trim(),
					billingDate: form.billingDate.trim(),
					category: form.category.trim(),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update subscription");
			}

			sessionStorage.removeItem("editSelectedId");
			navigate("/dashboard");
		} catch (error) {
			console.error("Error updating subscription:", error);
			alert("Failed to update subscription.");
		}
	}

	return (
		<main className="container main-wrap">
			<div className="page-head">
				<div>
					<h2 className="page-title">Edit Details</h2>
					<p className="page-subtitle">
						Update the fields and save changes.
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
						<label htmlFor="billingDate">Billing Date</label>
						<input
							id="billingDate"
							className="input"
							type="date"
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
							<option value="">Select a cetegory</option>
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
							Cancel
						</Link>

						<button className="button-primary" type="submit">
							Save changes
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}