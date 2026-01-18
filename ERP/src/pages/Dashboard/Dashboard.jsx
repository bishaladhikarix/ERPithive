import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
	const [activeModuleKey, setActiveModuleKey] = useState("");
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
			if(!localStorage.getItem("username") || !localStorage.getItem("organization") ){	

				try{
					// const responseUsername= await fetch(`${import.meta.env.VITE_API_URL}/getUsername`, {
					// 	method: 'POST',
					// 	headers: { 'Content-Type': 'application/json' },
					// 	body: JSON.stringify({email:localStorage.getItem("userEmail")})
					// });
					// if (!responseUsername.ok) throw new Error('Failed to fetch username');
					// const dataUsername = await responseUsername.json();
					// localStorage.setItem('username', dataUsername.username);

					const responseOrganization= await fetch(`${import.meta.env.VITE_API_URL}/getOrganization`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({email:localStorage.getItem("userEmail")})
					});
					if (!responseOrganization.ok) throw new Error('Failed to fetch organization');
					const dataOrganization = await responseOrganization.json();
					localStorage.setItem('organization', dataOrganization.organization);

				}catch(err){
					console.error(err);
				}
			}	



			
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/modules`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: localStorage.getItem("userEmail") }),	
				});

				if (!response.ok) {
					throw new Error("Failed to load modules.");
				}

				const data = await response.json();
				if (!isMounted) {
					return;
				}

				setModuleStatuses(data || {});
				const initialActive = Object.entries(data || {}).find(([, value]) => value);
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

	const enabledModules = useMemo(
		() =>
			Object.entries(moduleStatuses)
				.filter(([, status]) => Boolean(status))
				.map(([key]) => key),
		[moduleStatuses]
	);

	useEffect(() => {
		if (!activeModuleKey && enabledModules.length > 0) {
			setActiveModuleKey(enabledModules[0]);
		}
	}, [activeModuleKey, enabledModules]);

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
					<button
						type="button"
						className="logout-button"
						onClick={() => {
							localStorage.removeItem("token");
							navigate("/", { replace: true });
						}}
					>
						Log out
					</button>
				</header>
				<section className="dashboard-content">
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
