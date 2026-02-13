import React from 'react';

export function Add() {
  return (
    <main className="container main-wrap">
            <div className="page-head">
                <div>
                    <h2 className="page-title">Add Subscription</h2>
                    <p className="page-subtitle">Create a new recurring item for your dashboard.</p>
                </div>
            </div>

            <section className="card form-card">
                <form className="form-grid" method="get" action="dashboard.html">
                    <div className="field">
                        <label for="name">Subscription name</label>
                        <input id="name" className="input" type="text" placeholder="Disney+, Gym, Spotify..." />
                    </div>
                    <div className="field">
                        <label for="cost">Fixed cost</label>
                        <input id="cost" className="input" type="text" placeholder="$67.67" />
                    </div>
                    <div className="field">
                        <label for="cycle">Billing cycle</label>
                        <input id="cycle" className="input" type="text" placeholder="Monthly, Yearly, Weekly..." />
                    </div>
                    <div className="field">
                        <label for="last">Billing date</label>
                        <input id="last" className="input" type="text" placeholder="Wenduary 56th, 3005" />
                    </div>
                    <div className="field">
                        <label for="category">Category</label>
                        <input id="category" className="input" type="text" placeholder="Entertainment, Health, Work..." />
                    </div>
                    <div className="button-row field-wide">
                        <a className="button-secondary button-link" href="dashboard.html">Return to Dashboard</a>
                        <button className="button-primary" type="submit">Submit</button>
                    </div>
                </form>
            </section>
        </main>
  );
}