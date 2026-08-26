import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import PageContainer from "../../components/PageContainer";


function AdminDashboard() {
  const [stats, setStats] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          const response =
            await api.get(
              "/admin/dashboard"
            );

          setStats(response.data);

        } catch (error) {
          console.error(error);

          setError(
            "Unable to load dashboard."
          );

        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);


  if (loading) {
    return (
      <PageContainer>
        <div className="loading">
          Loading dashboard...
        </div>
      </PageContainer>
    );
  }


  if (error) {
    return (
      <PageContainer>
        <div className="alert alert-error">
          {error}
        </div>
      </PageContainer>
    );
  }


  return (
    <PageContainer>

      <div className="page-header">

        <div>
          <h1>
            Admin Dashboard
          </h1>

          <p>
            Overview of your helpdesk activity.
          </p>
        </div>


        <div className="page-actions">

          <Link
            to="/admin/tickets"
            className="btn btn-primary"
          >
            View All Tickets
          </Link>

        </div>

      </div>


      <div className="stats-grid">

        <div className="stat-card total">

          <div className="stat-label">
            Total Tickets
          </div>

          <div className="stat-value">
            {stats.total_tickets}
          </div>

        </div>


        <div className="stat-card open">

          <div className="stat-label">
            Open
          </div>

          <div className="stat-value">
            {stats.open_tickets}
          </div>

        </div>


        <div className="stat-card progress">

          <div className="stat-label">
            In Progress
          </div>

          <div className="stat-value">
            {stats.in_progress_tickets}
          </div>

        </div>


        <div className="stat-card closed">

          <div className="stat-label">
            Closed
          </div>

          <div className="stat-value">
            {stats.closed_tickets}
          </div>

        </div>

      </div>


      <div className="card">

        <div className="card-body">

          <h2>
            Ticket Management
          </h2>

          <p>
            Search, filter, assign and manage
            all support tickets.
          </p>

          <Link
            to="/admin/tickets"
            className="btn btn-secondary"
          >
            Manage Tickets
          </Link>

        </div>

      </div>

    </PageContainer>
  );
}


export default AdminDashboard;