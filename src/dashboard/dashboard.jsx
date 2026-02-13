import React from 'react';
import './dashboard.css'
import './forms.css'

export function Dashboard() {
  return (
    <main className="container main-wrap">
            <div className="page-head">
                <div>
                    <h2 className="page-title">Your Dashboard</h2>
                    <p className="page-subtitle">User: <span className="pill">noobmaster69</span></p>
                </div>

                <div className="button-row">
                    <a href="edit_sub.html" className="button-primary button-link">Edit</a>
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
                            <tr>
                                <td>Disney+</td>
                                <td>$4.99</td>
                                <td>Monthly</td>
                                <td>February 15th</td>
                                <td><span className="tag">Entertainment</span></td>
                            </tr>
                            <tr>
                                <td>Gym</td>
                                <td>$9.99</td>
                                <td>Monthly</td>
                                <td>February 1st</td>
                                <td><span className="tag tag-green">Health</span></td>
                            </tr>
                            <tr>
                                <td>Spotify</td>
                                <td>$4.99</td>
                                <td>Monthly</td>
                                <td>February 25th</td>
                                <td><span className="tag">Entertainment</span></td>
                            </tr>
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