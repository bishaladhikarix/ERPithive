import "./Dashboard.css";

const Dashboard = ({ user, onLogout }) => {
	const selectedModules = Array.isArray(user?.modules)
		? user.modules
		: [];

	return (
		<div className="dashboard-page">
			<div className="dashboard-card">
				<header className="dashboard-header">
					<div>
						<h1>ERP Dashboard</h1>
						<p>
							Welcome back,
							{" "}
							<span className="highlight">
								{user?.username || user?.email || "User"}
							</span>
							!
						</p>
						{user?.organization && (
							<p className="organization">
								Organization: <strong>{user.organization}</strong>
							</p>
						)}
					</div>
					<button className="logout-button" type="button" onClick={onLogout}>
						Log out
					</button>
				</header>

				<section className="dashboard-content">
					<h2>Active modules</h2>
					{selectedModules.length > 0 ? (
						<ul className="module-list">
							{selectedModules.map((module) => (
								<li key={module}>{module}</li>
							))}
						</ul>
					) : (
						<p className="empty-state">
							No modules assigned yet. Enable them from the admin panel.
						</p>
					)}
				</section>

				{user?.siteName && (
					<footer className="dashboard-footer">
						Site name: <strong>{user.siteName}</strong>
					</footer>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
