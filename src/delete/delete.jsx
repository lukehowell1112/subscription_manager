import React from 'react';

export function Delete() {
  return (
    <main className="container main-wrap">
            <div className="page-head">
                <div>
                    <h2 className="page-title">Delete Subscription</h2>
                    <p className="page-subtitle">Select a subscription and confirm deletion.</p>
                </div>
            </div>

            <section className="card form-card danger-card">
                <h3 className="danger-title">Choose a subscription</h3>
                <p className="danger-text">
                This action can’t be undone.(for this assignment it just returns to the dashboard)
                </p>

                <form className="vstack gap-3" method="get" action="dashboard.html">
                    <div className="choice-list">
                        <label className ="choice">
                            <input type="radio" name="sub" value="disney" checked />
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
                        <a className="button-secondary button-link" href="dashboard.html">Cancel</a>
                        <button className="button-danger" type="submit">Delete</button>
                    </div>
                </form>
            </section>
        </main>
  );
}