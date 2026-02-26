import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getSubscriptions, updateSubscription} from "../services/subscriptionService";

export function Edit_Form() {
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
				<form className="form-grid">
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
