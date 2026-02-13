import React from "react";

export function About() {
	return (
		<main className="container main-wrap">
			<section id="about-blah">
				<img
					className="about-image"
					src="/graph.png"
					alt="About page graph"
				/>

				<div>
					<h2 className="about-title">
						About Subscription Manager
					</h2>
					<p className="about-lead">
						We help you stay in control of your subscriptions so you
						always know where your money is going.
					</p>
				</div>
			</section>

			<section className="card about-card">
				<h3>Our Mission</h3>
				<p>
					Our mission is to give users clarity and confidence in their
					financial decisions. We believe no one should lose money to
					forgotten subscriptions or unexpected charges. Subscription
					Manager helps you see the full picture of your recurring
					expenses in one place.
				</p>
			</section>

			<section className="card about-card">
				<h3>What We Do</h3>
				<p>Subscription Manager allows users to:</p>
				<ul className="about-list">
					<li>Track all active subscriptions</li>
					<li>View monthly and yearly costs</li>
					<li>Organize services by category</li>
					<li>Stay aware of renewal dates</li>
					<li>Make informed budgeting decisions</li>
				</ul>
			</section>
		</main>
	);
}
