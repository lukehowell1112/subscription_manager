import React from "react";
import { Link } from "react-router-dom";

export function Edit_Sub() {
	return (
		<main className="container main-wrap">
			<div className="page-head">
				<div>
					<h2 className="page-title">Edit Subscriptions</h2>
					<p className="page-subtitle">Choose one to update its details.</p>
				</div>
			</div>

			<section className="card form-card">
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
						<Link className="button-secondary button-link" to="/dashboard">
							Cancel
						</Link>

						<Link className="button-primary button-link" to="/edit_form">
							Continue
						</Link>
					</div>
				</form>
			</section>
		</main>
	);
}
