import React, {useEffect, useState, useRef} from 'react';
import './app.css'
import './dashboard.css'
import '../forms.css'
import { getCurrentUser } from '../services/subscriptionService';

import { Link } from "react-router-dom";

export function Dashboard() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [user, setUser] = useState(getCurrentUser());
    const [advice, setAdvice] = useState("");

    const socketRef = useRef(null);
    const [liveMessage, setLiveMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		const syncUser = () => setUser(getCurrentUser());
		window.addEventListener("authchanged", syncUser);
		window.addEventListener("storage", syncUser);

		return () => {
			window.removeEventListener("authchanged", syncUser);
			window.removeEventListener("storage", syncUser);
		};
	}, []);

    function loadSubscriptions() {
        fetch('/api/subscriptions', {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setSubscriptions(data);
            })
            .catch((err) => {
                console.error('Error fetching subscriptions:', err);
            });
    }

    useEffect(() => {
        loadSubscriptions();
    }, []);

    useEffect(() => {
	fetch("https://api.api-ninjas.com/v2/randomquotes?categories=success", {
		headers: {
			"X-Api-Key": import.meta.env.VITE_QUOTES_API_KEY,
		},
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			if (data && data.length > 0) {
				setAdvice(data[0].quote);
			} else {
				setAdvice("No quote available right now.");
			}
		})
		.catch((err) => {
			console.error("Error fetching quote:", err);
			setAdvice("Failed to load quote.");
		});
    }, []);

    useEffect(() => {
	if (!liveMessage) return;

	setShowToast(false);

	const showTimer = setTimeout(() => {
		setShowToast(true);
	}, 10);

	const fadeTimer = setTimeout(() => {
		setShowToast(false);
	}, 2500);

	const removeTimer = setTimeout(() => {
		setLiveMessage("");
	}, 2800);

	return () => {
		clearTimeout(showTimer);
		clearTimeout(fadeTimer);
		clearTimeout(removeTimer);
	};
}, [liveMessage]);

    useEffect(() => {
        const socketUrl =
            window.location.hostname === "localhost"
                ? "ws://localhost:4000"
                : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;

        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WS message:", data);

                if (data.type === "notification" && data.message) {
                    setLiveMessage(data.message);
                }

                if (
                    data.type === "subscription_added" ||
                    data.type === "subscription_updated" ||
                    data.type === "subscription_deleted"
                ) {
                    loadSubscriptions();
                }
            } catch (err) {
                console.error("WS parse error:", err);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        return () => {
            socket.close();
        };
    }, []);
    
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

    function formatDate(dateString) {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-").map(Number);

        const date = new Date(year, month - 1, day);

        const monthName = date.toLocaleString("en-US", { month: "long" });
        const dayNum = date.getDate();
        const yearNum = date.getFullYear();

        function getSuffix(day) {
            if (day >= 11 && day <= 13) return "th";
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        }

        return `${monthName} ${dayNum}${getSuffix(dayNum)}, ${yearNum}`;
    }

    function getCategoryClass(category) {
        const normalized = String(category || "")
            .trim()
            .toLowerCase();
        
        if (!normalized) return "tag-other";

        return `tag-${normalized}`
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

    function handleEnableNotifications() {
        if (!socketRef.current || socketRef.current.readyState!== 1) {
            console.log("Socket not ready");
            return;
        }

        socketRef.current.send(JSON.stringify({
            type: "enable_notifications"
        }));
    }

    function handleShareDashboard() {
        if (!socketRef.current || socketRef.current.readyState !== 1) {
            console.log("Socket not ready");
            return;
        }

        socketRef.current.send(JSON.stringify({
            type: "share_dashbaord"
        }));
    }

    return (
        <main className="container main-wrap">
                <div className="page-head">
                    <div>
                        <h2 className="page-title">My Dashboard</h2>
                        <p className="page-subtitle">User: <span className="pill">{user || "Guest"}</span></p>
                    </div>

                    <section className="card summary-card">
                        <p className="summary-label">Financial Tip</p>
                        <p className="summary-value" style={{fontSize: "1rem", lineHeight: "1.5"}}>
                            {advice || "Loading advice..."}
                        </p>
                    </section>

                    <div className="button-row">
                        <Link to="/edit_sub" className="button-primary button-link">Edit</Link>
                        <button 
                            className="button-secondary" 
                            type="button"
                            onClick={handleEnableNotifications}
                        >
                            Enable Notifications
                        </button>
                    
                        <button 
                            className="button-secondary" 
                            type="button"
                            onClick={handleShareDashboard}
                        >
                            Share Dashboard
                        </button>
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
                                            <td>{sub.cycle
                                                ? sub.cycle.charAt(0).toUpperCase() + sub.cycle.slice(1)
                                                : ""}
                                            </td>
                                            <td>{formatDate(sub.billingDate)}</td>
                                            <td>
                                                <span className={`tag ${getCategoryClass(sub.category)}`}>
                                                    {sub.category
                                                        ? sub.category.charAt(0).toUpperCase() + sub.category.slice(1) : "Other"}
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
                        <p className="summary-value">
                            {topCategory && topCategory !== "—"
                                ? topCategory.charAt(0).toUpperCase() + topCategory.slice(1)
                                : topCategory}
                        </p>
                    </div>
                </section>
                {liveMessage && (
                    <div className={`live-toast ${showToast ? "show" : "hide"}`}>
                        {liveMessage}
                    </div>
                )}
            </main>
    );
}