import React from "react";
import { Link } from "react-router-dom";

export function Delete() {
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
					This action can’t be undone. (For this assignment it just returns to the dashboard.)
				</p>

				<form className="vstack gap-3">
					<div className="choice-list">
						<label className="choice">
							<input
								type="radio"
								name="sub"
								value="disney"
								defaultChecked
							/>
							<span>Disney+</span>
						</label>

						<label className="choice">
							<input type="radio" name="sub" value="gym" />
							<span>Gym</span>
						</label>

						<label className="choice">
							<input type="radio" name="sub" value="spotify" />
							<span>Spotify</span>
						</label>
					</div>

					<div className="button-row">
						<Link
							className="button-secondary button-link"
							to="/dashboard"
						>
							Cancel
						</Link>

						<Link
							className="button-danger button-link"
							to="/dashboard"
						>
							Delete
						</Link>
					</div>
				</form>
			</section>
		</main>
	);
}
