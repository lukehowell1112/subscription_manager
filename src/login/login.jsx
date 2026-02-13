import React from 'react';

export function Login() {
  return (
    <main className="container main-wrap">
            <section className="blah">
                <div className="blah-text">
                    <h2>The Smarter Way to Track Subscriptions</h2>
                    <p>Track recurring costs, see monthly totals, and stay in control.</p>
                </div>

                <div className="card login-card">
                    <h3>Login</h3>
                    <form method="get" action="dashboard.html">

                        <div className="field">
                            <label>Username:</label>
                            <input className="input" type="text" placeholder="Enter your username" />
                        </div>

                        <div className="field">
                            <label>Password:</label>
                            <input className="input" type="password" placeholder="Enter your password" />
                        </div>
                        
                        <div className="button-row">
                            <button className="button-primary" type="submit">Login</button>
                            <button className="button-secondary" type="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
  );
}