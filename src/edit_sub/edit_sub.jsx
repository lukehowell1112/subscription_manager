import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { getSubscriptions } from "../services/subscriptionService";

export function Edit_Sub() {
	const navigate = useNavigate();

	const [subscriptions, setSubscriptions] = useState([]);
	const [selectedId, setSelectedId] = useState(null)

	useEffect(() => {
		const subs = getSubscriptions();
		setSubscriptions(subs);
		setSelectedId(subs.length > 0 ? subs[0].id : null);
	}, []);

	function handleContinue(e) {
		e.preventDefault();

		if (selectedId == null) {
			alert("Please select a subscription.")
			return;
		}

		sessionStorage.setItem("editSelectedId", String(selectedId));
		navigate("/edit-form")
	}
	return (
		<main className="container main-wrap">
			<div className="page-head">
				<div>
					<h2 className="page-title">Edit Subscriptions</h2>
					<p className="page-subtitle">Choose one to update its details.</p>
				</div>
			</div>

			<section className="card form-card">
				<form className="vstack gap-3" onSubmit={handleContinue}>
					<div className="choice-list">
						{subscriptions.length === 0 ? (
							<p className="danger-text">
								No subscriptions available to edit.
							</p>
						) : (
							subscriptions.map((sub) => (
								<label
									className="choice"
									key={sub.id}
								>
									<input
										type="radio"
										name="sub"
										value={sub.id}
										checked={selectedId === sub.id}
										onChange={() =>
											setSelectedId(sub.id)
										}
									/>

									<span>
										{sub.name}
									</span>
								</label>
							))
						)}
					</div>

					<div className="button-row">
						<Link className="button-secondary button-link" to="/dashboard">
							Cancel
						</Link>

						<button className="button-primary" type="submit" disabled={subscriptions.length === 0}>
							Continue
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}
