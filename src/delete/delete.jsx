import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export function Delete() {
	const navigate = useNavigate();

	const [subscriptions, setSubscriptions] = useState([]);
	const [selectedId, setSelectedId] = useState(null);

	useEffect(() => {
		fetch("http://localhost:4000/api/subscriptions")
			.then((res) => res.json())
			.then((subs) => {
				setSubscriptions(subs);
				setSelectedId(subs.length > 0 ? subs[0].id : null);
			})
			.catch((err) => {
				console.error("Error fetching subscriptions:", err);
			});
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();

		if (selectedId == null) {
			alert("No subscription selected.");
			return;
		}

		try {
			const response = await fetch(`http://localhost:4000/api/subscriptions/${selectedId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete subscription");
			}

			navigate("/dashboard");
		} catch (error) {
			console.error("Error deleting subscription:", error);
			alert("Failed to delete subscription.");
		}
	}

	return (
		<main className="container main-wrap">
			<div className="page-head">
				<div>
					<h2 className="page-title">Delete Subscription</h2>
					<p className="page-subtitle">
						Select a subscription and confirm deletion.
					</p>
				</div>
			</div>

			<section className="card form-card danger-card">
				<h3 className="danger-title">Choose a subscription</h3>
				<p className="danger-text">
					This action can’t be undone.
				</p>

				<form className="vstack gap-3" onSubmit={handleSubmit}>
					<div className="choice-list">
						{subscriptions.length === 0 ? (
							<p className="danger-text">
								You don’t have any subscriptions to delete.
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
										onChange={() => setSelectedId(sub.id)}
									/>

									<span>
										{sub.name}
									</span>
								</label>
							))
						)}
					</div>

					<div className="button-row">
						<Link
							className="button-secondary button-link"
							to="/dashboard"
						>
							Cancel
						</Link>

						<button
							className="button-danger"
							type="submit"
							disabled={subscriptions.length === 0}
						>
							Delete
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}
