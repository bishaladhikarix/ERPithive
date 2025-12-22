import { useState } from "react";
import "./Login.css";

const Login = ({ onLogin, onNavigateSignup, loading = false, errorMessage = "" }) => {
	const [formData, setFormData] = useState({ email: "", password: "" });

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (typeof onLogin === "function") {
			await onLogin(formData);
			return;
		}
		console.log("Login attempt", formData);
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<h1>Welcome back</h1>
				<p>Sign in to access your ERP dashboard.</p>

				<form className="login-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							placeholder="Your secure password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>

					{errorMessage && (
						<div className="login-error" role="alert" aria-live="assertive">
							{errorMessage}
						</div>
					)}

					<button className="login-submit" type="submit" disabled={loading}>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<div className="login-footer">
					Need an account?{
						" "
					}
					<button
						className="link-button"
						type="button"
						onClick={onNavigateSignup}
					>
						Create one
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
