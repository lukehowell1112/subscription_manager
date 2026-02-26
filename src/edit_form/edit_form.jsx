import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getSubscriptions, updateSubscription} from "../services/subscriptionService";

export function Edit_Form() {
	const navigate = useNavigate();

	const [selectedId, setSelcetedId] = useState(null);
	const [form, setForm] = useState({
		name: "",
		cost: "",
		cycle: "",
		billingDate: "",
		category: "",
	});

	useEffect(() => {
		const raw = sessionStorage.getItem("editSelectedId");
		const id = raw ? Number(raw) : null;
		setSelcetedId(id);

		if (id == null) {
			alert("No subscription selected to edit.");
			navigate("/edit_sub");
			return;
		}

		const subs = getSubscriptions();
		const sub = subs.find((s) => s.id === id);

		if (!sub) {
			alert("Could not find that subscription.");
			navigate("/dashboard")
			return;
		}

		setForm({
			name: sub.name ?? "",
			cost: String(sub.cost ?? ""),
			cycle: sub.cycle ?? "",
			billingDate: sub.billingDate ?? "",
			category: sub.category ?? "",
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

function handleSubmit(e) {
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

	updateSubscription(selectedId, {
		name: form.name.trim(),
		cost: costNumber,
		cycle: form.cycle.trim(),
		billingDate: form.billingDate.trim(),
		category: form.category.trim(),
	});

	sessionStorage.removeItem("editSelectedId");
	navigate("/dashboard");
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
							defaultValue="Disney+"
						/>
					</div>

					<div className="field">
						<label htmlFor="cost">Fixed cost</label>
						<input
							id="cost"
							className="input"
							type="text"
							defaultValue="$4.99"
						/>
					</div>

					<div className="field">
						<label htmlFor="cycle">Billing cycle</label>
						<input
							id="cycle"
							className="input"
							type="text"
							defaultValue="Monthly"
						/>
					</div>

					<div className="field">
						<label htmlFor="last">Last billed</label>
						<input
							id="last"
							className="input"
							type="text"
							defaultValue="Feb 1, 2026"
						/>
					</div>

					<div className="field">
						<label htmlFor="category">Category</label>
						<input
							id="category"
							className="input"
							type="text"
							defaultValue="Entertainment"
						/>
					</div>

					<div className="button-row field-wide">
						<Link
							className="button-secondary button-link"
							to="/dashboard"
						>
							Cancel
						</Link>

						<Link
							className="button-primary button-link"
							to="/dashboard"
						>
							Save changes
						</Link>
					</div>
				</form>
			</section>
		</main>
	);
}
