import React from "react";
import {Navigate} from "react-router-dom";
import {getCurrentUser} from "../services/subscriptionService";

export function RequireAuth({children}) {
	const user = getCurrentUser();
	if (!user) return <Navigate to="/" replace />;
	return children;
}