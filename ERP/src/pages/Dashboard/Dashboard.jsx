import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateModule } from "../../services/auth.js";
import Hr from "../../component/Hr.jsx";
import Inventory from "../../component/Inventory.jsx";
import "./Dashboard.css";

const MODULE_COMPONENTS = {
	hr: Hr,
	inventory: Inventory,
};

const Dashboard = () => {
	const navigate = useNavigate();
	const [moduleStatuses, setModuleStatuses] = useState({});
	const [pendingModuleStatuses, setPendingModuleStatuses] = useState({});
	const [activeModuleKey, setActiveModuleKey] = useState("");
	const [isManagingModules, setIsManagingModules] = useState(false);
	const [isSavingModules, setIsSavingModules] = useState(false);
	const [updateFeedback, setUpdateFeedback] = useState({ type: "", text: "" });
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const existingToken = localStorage.getItem("token");
		if (!existingToken) {
			navigate("/", { replace: true });
			return;
		}

		let isMounted = true;

		const fetchModules = async () => {
			setIsLoading(true);
			setError("");
			// if(!localStorage.getItem("organization") ){	

			// 	try{
			// 		// const responseUsername= await fetch(`${import.meta.env.VITE_API_URL}/getUsername`, {
			// 		// 	method: 'POST',
			// 		// 	headers: { 'Content-Type': 'application/json' },
			// 		// 	body: JSON.stringify({email:localStorage.getItem("userEmail")})
			// 		// });
			// 		// if (!responseUsername.ok) throw new Error('Failed to fetch username');
			// 		// const dataUsername = await responseUsername.json();
			// 		// localStorage.setItem('username', dataUsername.username);

			// 		const responseOrganization= await fetch(`${import.meta.env.VITE_API_URL}/getOrganization`, {
			// 			method: 'POST',
			// 			headers: { 'Content-Type': 'application/json' },
			// 			body: JSON.stringify({email:localStorage.getItem("userEmail")})
			// 		});
			// 		if (!responseOrganization.ok) throw new Error('Failed to fetch organization');
			// 		const dataOrganization = await responseOrganization.json();
			// 		localStorage.setItem('organization', dataOrganization.organization);

			// 	}catch(err){
			// 		console.error(err);
			// 	}
			// }	



			
			try {
				const emaill = localStorage.getItem("userEmail");
				const response = await fetch(`${import.meta.env.VITE_API_URL}/user/modules`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: emaill }),	
				});

				if (!response.ok) {
					console.log(response.message)
					throw new Error("Failed to load modules.");
				}

				const data = await response.json();
				if (!isMounted) {
					return;
				}

				console.log(data.modules.hr)

				setModuleStatuses(data.modules || {});
				const initialActive = Object.entries(data.modules || {}).find(([, value]) => value);
				setActiveModuleKey(initialActive ? initialActive[0] : "");
			} catch (fetchError) {
				if (!isMounted) {
					return;
				}
				console.error("Error fetching modules:", fetchError);
				setError(fetchError instanceof Error ? fetchError.message : "Unable to load modules.");
			} finally {
				if (isMounted) {
					setIsLoading(false);	
				}
			}
		};

		fetchModules();

		return () => {
			isMounted = false;
		};
	}, [navigate]);

	useEffect(() => {
		if (Object.keys(moduleStatuses).length === 0) {
			setPendingModuleStatuses({});
			return;
		}
		setPendingModuleStatuses({ ...moduleStatuses });
	}, [moduleStatuses]);

	const enabledModules = useMemo(
		() =>
			Object.entries(moduleStatuses)
				.filter(([, status]) => Boolean(status))
				.map(([key]) => key),
		[moduleStatuses]
	);

	const hasModuleChanges = useMemo(() => {
		const keys = new Set([
			...Object.keys(moduleStatuses),
			...Object.keys(pendingModuleStatuses),
		]);
		for (const key of keys) {
			if (Boolean(moduleStatuses[key]) !== Boolean(pendingModuleStatuses[key])) {
				return true;
			}
		}
		return false;
	}, [moduleStatuses, pendingModuleStatuses]);

	useEffect(() => {
		if (!activeModuleKey && enabledModules.length > 0) {
			setActiveModuleKey(enabledModules[0]);
		}
	}, [activeModuleKey, enabledModules]);

	useEffect(() => {
		if (activeModuleKey && !enabledModules.includes(activeModuleKey)) {
			setActiveModuleKey(enabledModules[0] || "");
		}
	}, [activeModuleKey, enabledModules]);

	const handleModuleToggle = (moduleKey) => {
		setPendingModuleStatuses((currentStatuses) => ({
			...currentStatuses,
			[moduleKey]: !currentStatuses[moduleKey],
		}));
	};

	const handleModuleUpdate = async () => {
		setIsSavingModules(true);
		setUpdateFeedback({ type: "", text: "" });

		try {
			const email = localStorage.getItem("userEmail");
			if (!email) {
				throw new Error("Missing user email. Please log in again.");
			}

			const response = await updateModule(email, pendingModuleStatuses);
			const nextStatuses = response?.modules ? { ...response.modules } : { ...pendingModuleStatuses };
			setModuleStatuses(nextStatuses);
			setUpdateFeedback({ type: "success", text: response?.message || "Modules updated successfully." });
		} catch (updateError) {
			const message = updateError instanceof Error ? updateError.message : "Failed to update modules.";
			setUpdateFeedback({ type: "error", text: message });
		} finally {
			setIsSavingModules(false);
		}
	};

	const handleModuleManagerClose = () => {
		setPendingModuleStatuses({ ...moduleStatuses });
		setUpdateFeedback({ type: "", text: "" });
		setIsManagingModules(false);
	};

	const ActiveModuleComponent = activeModuleKey ? MODULE_COMPONENTS[activeModuleKey] : null;

	return (
		<div className="dashboard-layout">
			<aside className="sidebar">
				<div className="sidebar-header">
					<h2>Modules</h2>
				</div>
				<nav className="module-nav">
					{isLoading && <span className="sidebar-status">Loading...</span>}
					{!isLoading && enabledModules.length === 0 && (
						<span className="sidebar-status">No modules available</span>
					)}
					{enabledModules.map((moduleKey) => (
						<button
							key={moduleKey}
							className={moduleKey === activeModuleKey ? "module-link active" : "module-link"}
							onClick={() => setActiveModuleKey(moduleKey)}
						>
							{moduleKey.replace(/^(\w)/, (match) => match.toUpperCase())}
						</button>
					))}
				</nav>
			</aside>
			<main className="dashboard-main">
				<header className="dashboard-main-header">
					<h1>ERP Dashboard</h1>
					<div className="dashboard-actions">
						<button
							type="button"
							className="manage-modules-button"
							onClick={() => {
								setIsManagingModules((previous) => !previous);
								setUpdateFeedback({ type: "", text: "" });
							}}
						>
							{isManagingModules ? "Close Module Manager" : "Manage Modules"}
						</button>
						<button
							type="button"
							className="logout-button"
							onClick={() => {
								localStorage.clear();
								navigate("/", { replace: true });
							}}
						>
							Log out
						</button>
					</div>
				</header>
				<section className="dashboard-content">
					{isManagingModules && (
						<div className="module-manager">
							<div className="module-manager-header">
								<h2>Manage Modules</h2>
								<p>Enable or disable modules for your organization.</p>
							</div>
							<div className="module-manager-grid">
								{Object.keys(pendingModuleStatuses).map((moduleKey) => (
									<label key={moduleKey} className="module-manager-option">
										<input
											type="checkbox"
											checked={Boolean(pendingModuleStatuses[moduleKey])}
											onChange={() => handleModuleToggle(moduleKey)}
											disabled={isSavingModules}
										/>
										<span>{moduleKey.replace(/^(\w)/, (match) => match.toUpperCase())}</span>
									</label>
								))}
								{Object.keys(pendingModuleStatuses).length === 0 && (
									<span className="module-manager-empty">No modules available to manage.</span>
								)}
							</div>
							{updateFeedback.text && (
								<div
									className={
										updateFeedback.type === "error"
											? "module-manager-feedback error"
											: "module-manager-feedback success"
									}
								>
									{updateFeedback.text}
								</div>
							)}
							<div className="module-manager-actions">
								<button
									type="button"
									className="module-manager-cancel"
									onClick={handleModuleManagerClose}
									disabled={isSavingModules}
								>
									Cancel
								</button>
								<button
									type="button"
									className="module-manager-save"
									onClick={handleModuleUpdate}
									disabled={
										isSavingModules ||
										Object.keys(pendingModuleStatuses).length === 0 ||
										!hasModuleChanges
									}
								>
									{isSavingModules ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</div>
					)}
					{error && <div className="dashboard-error">{error}</div>}
					{!error && ActiveModuleComponent ? (
						<ActiveModuleComponent />
					) : !error && enabledModules.length === 0 ? (
						<p className="empty-state">Enable a module to get started.</p>
					) : null}
				</section>
			</main>
		</div>
	);
};

export default Dashboard;
