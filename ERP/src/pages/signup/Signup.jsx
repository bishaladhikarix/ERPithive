import { useState } from "react";
import "./Signup.css";

const Signup = ({ onSignup, onNavigateLogin, loading = false, errorMessage = "" }) => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		organization: "",
		siteName: "",
		modules: {
			hr: false,
			inventory: false,
		},
	});

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
		if (typeof onSignup === "function") {
			await onSignup(formData);
			return;
		}
		console.log("Signup attempt", formData);
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

					<button className="signup-submit" type="submit" disabled={loading}>
						{loading ? "Creating account..." : "Create account"}
					</button>
				</form>

				<div className="signup-footer">
					Already registered?{
						" "
					}
					<button
						className="link-button"
						type="button"
						onClick={onNavigateLogin}
					>
						Sign in instead
					</button>
				</div>
			</div>
		</div>
	);
};

export default Signup;
