import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.js";
import "./Login.css";

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const existingToken = localStorage.getItem("token");
		if (existingToken) {
			navigate("/dashboard", { replace: true });
		}
	}, [navigate]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setErrorMessage("");

		try {
			const response = await loginUser(formData);

			if (!response) {
				throw new Error("Invalid email or password.");
			}

			const token =
				response.token ||
				response.sid ||
				response.accessToken ||
				response.access_token ||
				response.authToken ||
				response.data?.token ||
				"";

			if (token) {
				localStorage.setItem("token", token);
			} else {
				// fallback token for dev scenarios
				localStorage.setItem("token", "session-active");
			}
			
			if(response.ok){
				localStorage.setItem("loggedIn", "true");
				localStorage.setItem("userEmail", formData.email);
			}

			navigate("/dashboard", { replace: true });
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : "Unable to sign in."
			);
			localStorage.removeItem("token");
			localStorage.removeItem("loggedIn");
		} finally {
			setLoading(false);
		}
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

				<div className="login-footer" >
					Need an account? <Link to="/signup">Create one</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
