import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.js";
import "./Signup.css";

const Signup = () => {
	const navigate = useNavigate();
	const redirectTimerRef = useRef(null);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		organization: "",
		siteName: "",
		modules: {
			hr: false,
			inventory: false,
		},
	});
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		const existingToken = localStorage.getItem("token");
		if (existingToken) {
			navigate("/dashboard", { replace: true });
		}
	}, [navigate]);

	useEffect(
		() => () => {
			if (redirectTimerRef.current) {
				clearTimeout(redirectTimerRef.current);
			}
		},
		[]
	);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleModuleToggle = (event) => {
		const { name, checked } = event.target;
		setFormData((prev) => ({
			...prev,
			modules: {
				...prev.modules,
				[name]: checked,
			},
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setErrorMessage("");
		setSuccessMessage("");

		const selectedModules = Object.entries(formData.modules)
			.filter(([, enabled]) => enabled)
			.map(([moduleKey]) => (moduleKey === "hr" ? "HR" : "Inventory"));

		const payload = {
			username: formData.username,
			email: formData.email,
			password: formData.password,
			organization: formData.organization,
			site_name: formData.siteName,
			modules: formData.modules,
			selectedModules,
		}; 
		console.log("Signup payload:", payload);
		try {
			const response = await registerUser(payload);
			if (!response) {
				throw new Error("Unable to create account.");
			}

			setSuccessMessage("Account created successfully. You can now sign in.");
			setFormData({
				username: "",
				email: "",
				password: "",
				organization: "",
				siteName: "",
				modules: { hr: false, inventory: false },
			});

			if (redirectTimerRef.current) {
				clearTimeout(redirectTimerRef.current);
			}
			redirectTimerRef.current = setTimeout(() => {
				navigate("/", { replace: true });
			}, 1200);
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : "Unable to create account."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="signup-page">
			<div className="signup-card">
				<h1>Create your account</h1>
				<p>Tell us about your organization to get started.</p>

				<form className="signup-form" onSubmit={handleSubmit}>
					<div className="form-row two-column">
						<div className="form-group">
							<label htmlFor="username">Username</label>
							<input
								id="username"
								name="username"
								type="text"
								placeholder="janedoe"
								value={formData.username}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="jane@company.com"
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="Create a secure password"
								value={formData.password}
								onChange={handleInputChange}
								required
							/>
						</div>
					</div>

					<div className="form-row two-column">
						<div className="form-group">
							<label htmlFor="organization">Organization name</label>
							<input
								id="organization"
								name="organization"
								type="text"
								placeholder="Acme Corporation"
								value={formData.organization}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="siteName">Site name</label>
							<input
								id="siteName"
								name="siteName"
								type="text"
								placeholder="acme-erp"
								value={formData.siteName}
								onChange={handleInputChange}
								required
							/>
						</div>
					</div>

					<fieldset className="modules-wrapper">
						<legend>Select modules</legend>
						<label className="module-option" htmlFor="module-hr">
							<input
								id="module-hr"
								name="hr"
								type="checkbox"
								checked={formData.modules.hr}
								onChange={handleModuleToggle}
							/>
							Human Resources
						</label>

						<label className="module-option" htmlFor="module-inventory">
							<input
								id="module-inventory"
								name="inventory"
								type="checkbox"
								checked={formData.modules.inventory}
								onChange={handleModuleToggle}
							/>
							Inventory Management
						</label>
					</fieldset>

					{errorMessage && (
						<div className="signup-error" role="alert" aria-live="assertive">
							{errorMessage}
						</div>
					)}

					{successMessage && (
						<div className="signup-success" role="status" aria-live="polite">
							{successMessage}
						</div>
					)}

					<button className="signup-submit" type="submit" disabled={loading}>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</form>

				<div className="signup-footer">
					Already registered? <Link className="link-button" to="/">Sign in instead</Link>
				</div>
			</div>
		</div>
	);
};

export default Signup;
