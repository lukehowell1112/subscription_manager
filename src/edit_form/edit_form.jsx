import React from 'react';

export function Edit_Form() {
  return (
    <main className="container main-wrap">
			<div className="page-head">
				<div>
					<h2 className="page-title">Edit Details</h2>
					<p className="page-subtitle">Update the fields and save changes.</p>
				</div>
			</div>

			<section className="card form-card">
				<form className="form-grid" method="get" action="dashboard.html">
					<div className="field">
						<label for="name">Subscription name</label>
						<input id="name" className="input" type="text" value="Disney+" />
					</div>

					<div className="field">
						<label for="cost">Fixed cost</label>
						<input id="cost" className="input" type="text" value="$4.99" />
					</div>

					<div className="field">
						<label for="cycle">Billing cycle</label>
						<input id="cycle" className="input" type="text" value="Monthly" />
					</div>

					<div className="field">
						<label for="last">Last billed</label>
						<input id="last" className="input" type="text" value="Feb 1, 2026" />
					</div>

					<div className="field">
						<label for="category">Category</label>
						<input id="category" className="input" type="text" value="Entertainment" />
					</div>

					<div className="button-row field-wide">
						<a className="button-secondary button-link" href="dashboard.html">Cancel</a>
						<button className="button-primary" type="submit">Save changes</button>
					</div>
				</form>
			</section>
		</main>
  );
}