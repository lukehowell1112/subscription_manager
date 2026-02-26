import React, {useEffect, useMemo, useState} from 'react';
import './app.css'
import './dashboard.css'
import './forms.css'
import { getSubscriptions } from '../services/subscriptionService';

import { Link } from "react-router-dom";

export function Dashboard() {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {setSubscriptions(getSubscriptions());}, []);
    
    return (
        <main className="container main-wrap">
                <div className="page-head">
                    <div>
                        <h2 className="page-title">Your Dashboard</h2>
                        <p className="page-subtitle">User: <span className="pill">noobmaster69</span></p>
                    </div>

                    <div className="button-row">
                        <Link to="/edit-sub" className="button-primary button-link">Edit</Link>
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
                        <p className="summary-value">$19.97</p>
                    </div>

                    <div className="card summary-card">
                        <p className="summary-label">Subscriptions</p>
                        <p className="summary-value">3</p>
                    </div>

                    <div className="card summary-card">
                        <p className="summary-label">Top category</p>
                        <p className="summary-value">Entertainment</p>
                    </div>
                </section>
            </main>
    );
}