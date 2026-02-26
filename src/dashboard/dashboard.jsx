import React, {useEffect, useState} from 'react';
import './app.css'
import './dashboard.css'
import './forms.css'
import { getSubscriptions } from '../services/subscriptionService';

import { Link } from "react-router-dom";

export function Dashboard() {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {setSubscriptions(getSubscriptions());}, []);
    
    function toMonthly(cost, cycle) {
        const c = Number(cost);
        if (!Number.isFinite(c)) return 0;

        const normalized = String(cycle || "")
            .trim()
            .toLowerCase();

        if (normalized.startsWith("month")) return c;
        if (normalized.startsWith("year") || normalized.startsWith("annual")) return c / 12;

        return c;
    }

    const monthlyTotal = subscriptions.reduce(
		(sum, sub) => sum + toMonthly(sub.cost, sub.cycle),
        0
	);

	const subscriptionCount = subscriptions.length;

	const topCategory = (() => {
		if (subscriptions.length === 0) return "—";

		const counts = {};

		for (const sub of subscriptions) {
			const cat =
				(sub.category || "Uncategorized").trim() ||
				"Uncategorized";

			counts[cat] = (counts[cat] || 0) + 1;
		}

		return Object
			.entries(counts)
			.sort((a, b) => b[1] - a[1])[0][0];
	})();

    return (
        <main className="container main-wrap">
                <div className="page-head">
                    <div>
                        <h2 className="page-title">Your Dashboard</h2>
                        <p className="page-subtitle">User: <span className="pill">noobmaster69</span></p>
                    </div>

                    <div className="button-row">
                        <Link to="/edit_sub" className="button-primary button-link">Edit</Link>
                        <button className="button-secondary" type="button">Enable Notifications</button>
                        <button className="button-secondary" type="button">Share Dashboard</button>
                    </div>
                </div>

                <section className="card table-card">
                    <div className="table-wrap">
                        <table className="sub-table">
                            <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Price</th>
                                    <th>Cycle</th>
                                    <th>Next Billing</th>
                                    <th>Category</th>
                                </tr>
                            </thead>

                            <tbody>
                                {subscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            No subscriptions yet. Add one to get started.
                                        </td>
                                    </tr>
                                ) : (

                                    subscriptions.map((sub) => (
                                        <tr key={sub.id}>
                                            <td>{sub.name}</td>
                                            <td>${Number(sub.cost).toFixed(2)}</td>
                                            <td>{sub.cycle}</td>
                                            <td>{sub.billingDate}</td>
                                            <td>
                                                <span className="tag">
                                                    {sub.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </section>

                <section className="summary-grid">
                    <div className="card summary-card">
                        <p className="summary-label">Monthly total</p>
                        <p className="summary-value">${monthlyTotal.toFixed(2)}</p>
                    </div>

                    <div className="card summary-card">
                        <p className="summary-label">Subscriptions</p>
                        <p className="summary-value">{subscriptionCount}</p>
                    </div>

                    <div className="card summary-card">
                        <p className="summary-label">Top category</p>
                        <p className="summary-value">{topCategory}</p>
                    </div>
                </section>
            </main>
    );
}