import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';


import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Add } from './add/add';
import { Delete } from './delete/delete';
import { Edit_Sub } from './edit_sub/edit_sub';
import { Edit_Form } from './edit_form/edit_form';
import { About } from './about/about';
import { RequireAuth } from "./auth/RequireAuth";
import { getCurrentUser, logout } from './services/subscriptionService';


export default function App() {
    const [user, setUser] = useState(getCurrentUser());

    useEffect(() => {
        const syncUser = () => setUser(getCurrentUser());
        window.addEventListener("storage", syncUser);
        return () => window.removeEventListener("storage", syncUser);
    }, []);

    function handleLogout() {
        logout();
        setUser(null);
    }

    return (
        <BrowserRouter>
        <div className="body">
            <header className="site-header">
                <div className="container">
                    <div className="header-row">
                        <div className="brand">
                            <img src="favicon.ico" alt="Subscription Manager icon" className="brand-icon"/>
                            <h1>Subscription Manager<sup>&reg;</sup></h1>
                        </div>

                        <nav className="site-nav">
                            <menu className="nav-list">
                                <li><NavLink className="nav-link" to="/">Home</NavLink></li>
                                {user && (
                                    <li>
                                        <NavLink className="nav-link" to="/dashboard">
                                            Dashboard
                                        </NavLink>
                                    </li>
                                )}

                                {user && (
                                    <li className="dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Edit Dashboard
                                        </a>

                                        <ul className="dropdown-menu dropdown-menu-dark">
                                            <li><NavLink className="dropdown-item" to="/add">Add Subscription</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="/edit_sub">Edit Subscription</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="/delete">Delete Subscription</NavLink></li>
                                        </ul>
                                    </li>
                                )}
                                <li><NavLink className="nav-link" to="/about">About</NavLink></li>

                                {user && (
                                    <li>
                                        <button
                                            className="nav-link"
                                            type="button"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                )}
                            </menu>
                        </nav>
                    </div>
                </div>    
            </header>

        <Routes>
            <Route path='/' element={<Login />} exact />
            <Route path='/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path='/add' element={<RequireAuth><Add /></RequireAuth>} />
            <Route path='/delete' element={<RequireAuth><Delete /></RequireAuth>} />
            <Route path='/edit_sub' element={<RequireAuth><Edit_Sub /></RequireAuth>} />
            <Route path='/edit_form' element={<RequireAuth><Edit_Form /></RequireAuth>} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NotFound />} />
        </Routes>

            <footer className="site-footer">
                <div className="container footer-row">
                    <span className="text-reset">Created by Luke Howell</span>
                    <NavLink to="https://github.com/lukehowell1112/subscription_manager">GitHub</NavLink>
                </div>
            </footer>

        </div>
        </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}