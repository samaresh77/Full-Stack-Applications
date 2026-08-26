import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import PageContainer from "../../components/PageContainer";
import StatusBadge from "../../components/StatusBadge";


function AdminTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [supportUsers, setSupportUsers] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================================================
  // FETCH TICKET
  // =========================================================

  const fetchTicket = async () => {
    try {
      const response = await api.get(
        `/admin/tickets/${id}`
      );

      const data = response.data;

      setTicket(data);

      // Current status
      setSelectedStatus(data.status);

      // Current assigned user
      if (data.assigned_to) {
        setSelectedUser(
          String(data.assigned_to.id)
        );
      } else {
        setSelectedUser("");
      }

    } catch (error) {
      console.error(error);

      if (error.response?.status === 404) {
        setError("Ticket not found.");
      } else if (error.response?.status === 403) {
        setError("Admin access required.");
      } else {
        setError(
          "Failed to load ticket."
        );
      }
    }
  };


  // =========================================================
  // FETCH SUPPORT USERS
  // =========================================================

  const fetchSupportUsers = async () => {
    try {
      const response = await api.get(
        "/admin/support-users"
      );

      setSupportUsers(response.data);

    } catch (error) {
      console.error(error);

      setError(
        "Failed to load support users."
      );
    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchTicket(),
        fetchSupportUsers(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [id]);


  // =========================================================
  // STATUS OPTIONS
  // =========================================================

  const getStatusOptions = () => {
    if (!ticket) {
      return [];
    }

    switch (ticket.status) {

      case "Open":
        return [
          {
            value: "Open",
            label: "Open",
          },
          {
            value: "In Progress",
            label: "In Progress",
          },
        ];


      case "In Progress":
        return [
          {
            value: "In Progress",
            label: "In Progress",
          },
          {
            value: "Closed",
            label: "Closed",
          },
        ];


      case "Closed":
        return [
          {
            value: "Closed",
            label: "Closed",
          },
        ];


      default:
        return [
          {
            value: ticket.status,
            label: ticket.status,
          },
        ];
    }
  };


  // =========================================================
  // CHANGE STATUS
  // =========================================================

  const handleStatusChange = async () => {

    if (!selectedStatus) {
      setError(
        "Please select a status."
      );
      return;
    }


    if (selectedStatus === ticket.status) {
      setError(
        "Please select a different status."
      );
      return;
    }


    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/tickets/${id}/status`,
        {
          status: selectedStatus,
        }
      );


      /*
       * Update local ticket state.
       *
       * Depending on your backend response,
       * response.data may contain the complete
       * ticket or only updated fields.
       */

      setTicket((previous) => ({
        ...previous,
        status:
          response.data.status ||
          selectedStatus,

        updated_at:
          response.data.updated_at ||
          previous.updated_at,
      }));


      setSelectedStatus(
        response.data.status ||
        selectedStatus
      );


      setSuccess(
        "Ticket status updated successfully."
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to update ticket status."
      );

      // Restore current status
      setSelectedStatus(
        ticket.status
      );

    } finally {
      setActionLoading(false);
    }
  };


  // =========================================================
  // ASSIGN SUPPORT USER
  // =========================================================

  const handleAssignment = async () => {

    if (!selectedUser) {
      setError(
        "Please select a support user."
      );
      return;
    }


    try {
      setActionLoading(true);
      setError("");
      setSuccess("");


      const response = await api.patch(
        `/admin/tickets/${id}/assign`,
        {
          support_user_id:
            Number(selectedUser),
        }
      );


      /*
       * Find the complete user object
       * from our support user list.
       */

      const assignedUser =
        supportUsers.find(
          (user) =>
            user.id ===
            Number(selectedUser)
        );


      setTicket((previous) => ({
        ...previous,

        assigned_to:
          assignedUser || {
            id: Number(selectedUser),
            username:
              response.data.username ||
              "Support User",
          },

        updated_at:
          response.data.updated_at ||
          previous.updated_at,
      }));


      setSuccess(
        `Ticket assigned to ${
          assignedUser?.username ||
          "support user"
        }.`
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to assign ticket."
      );

    } finally {
      setActionLoading(false);
    }
  };


  // =========================================================
  // DELETE TICKET
  // =========================================================

  const handleDelete = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this ticket?"
    );


    if (!confirmed) {
      return;
    }


    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/tickets/${id}`
      );

      navigate("/admin/tickets");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to delete ticket."
      );

      setActionLoading(false);
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <PageContainer>

        <div className="loading">
          Loading ticket...
        </div>

      </PageContainer>
    );
  }


  // =========================================================
  // TICKET NOT FOUND
  // =========================================================

  if (!ticket) {
    return (
      <PageContainer>

        <div className="form-page">

          <div className="card">

            <div className="empty-state">

              <h3>
                Unable to load ticket
              </h3>

              <p>
                {error}
              </p>

              <Link
                to="/admin/tickets"
                className="btn btn-primary"
              >
                Back to All Tickets
              </Link>

            </div>

          </div>

        </div>

      </PageContainer>
    );
  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <PageContainer>

      <div className="form-page">

        {/* Back */}

        <Link
          to="/admin/tickets"
          className="back-link"
        >
          ← Back to All Tickets
        </Link>


        {/* Ticket card */}

        <div className="ticket-detail-card card">

          {/* Header */}

          <div className="ticket-detail-header">

            <h1>
              {ticket.title}
            </h1>

            <StatusBadge
              status={ticket.status}
            />

          </div>


          {/* Body */}

          <div className="ticket-detail-body">

            {/* Messages */}

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}


            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}


            {/* Description */}

            <h3>
              Description
            </h3>

            <div className="ticket-description">
              {ticket.description}
            </div>


            {/* Ticket information */}

            <div className="detail-grid">

              <div className="detail-item">

                <span className="detail-label">
                  Ticket ID
                </span>

                <span className="detail-value">
                  #{ticket.id}
                </span>

              </div>


              <div className="detail-item">

                <span className="detail-label">
                  Created By
                </span>

                <span className="detail-value">

                  {ticket.created_by
                    ? ticket.created_by.username
                    : "Unknown"}

                </span>

              </div>


              <div className="detail-item">

                <span className="detail-label">
                  Assigned To
                </span>

                <span className="detail-value">

                  {ticket.assigned_to
                    ? ticket.assigned_to.username
                    : "Unassigned"}

                </span>

              </div>


              <div className="detail-item">

                <span className="detail-label">
                  Created
                </span>

                <span className="detail-value">

                  {new Date(
                    ticket.created_at
                  ).toLocaleString()}

                </span>

              </div>


              <div className="detail-item">

                <span className="detail-label">
                  Last Updated
                </span>

                <span className="detail-value">

                  {new Date(
                    ticket.updated_at
                  ).toLocaleString()}

                </span>

              </div>

            </div>


            {/* =================================================
                STATUS MANAGEMENT
                ================================================= */}

            <section className="management-section">

              <h2>
                Change Status
              </h2>

              <p>
                Move this ticket through the
                helpdesk workflow.
              </p>


              <div className="management-row">

                <select
                  className="form-control"
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target.value
                    )
                  }
                  disabled={
                    actionLoading ||
                    ticket.status === "Closed"
                  }
                >

                  {getStatusOptions().map(
                    (option) => (

                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>

                    )
                  )}

                </select>


                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStatusChange}
                  disabled={
                    actionLoading ||
                    selectedStatus ===
                      ticket.status ||
                    ticket.status ===
                      "Closed"
                  }
                >
                  {actionLoading
                    ? "Updating..."
                    : "Update Status"}
                </button>

              </div>


              {ticket.status === "Closed" && (
                <p
                  style={{
                    marginTop: "12px",
                    marginBottom: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Closed tickets cannot be
                  reopened.
                </p>
              )}

            </section>


            {/* =================================================
                ASSIGNMENT
                ================================================= */}

            <section className="management-section">

              <h2>
                Assign Support User
              </h2>

              <p>
                Choose which support user should
                handle this ticket.
              </p>


              {supportUsers.length === 0 ? (

                <div className="alert alert-error">
                  No support users are available.
                </div>

              ) : (

                <div className="management-row">

                  <select
                    className="form-control"
                    value={selectedUser}
                    onChange={(event) =>
                      setSelectedUser(
                        event.target.value
                      )
                    }
                    disabled={actionLoading}
                  >

                    <option value="">
                      Select Support User
                    </option>


                    {supportUsers.map(
                      (supportUser) => (

                        <option
                          key={supportUser.id}
                          value={
                            supportUser.id
                          }
                        >
                          {supportUser.username}
                        </option>

                      )
                    )}

                  </select>


                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAssignment}
                    disabled={
                      actionLoading ||
                      !selectedUser
                    }
                  >
                    {actionLoading
                      ? "Assigning..."
                      : "Assign Ticket"}
                  </button>

                </div>

              )}

            </section>


            {/* =================================================
                DELETE
                ================================================= */}

            <section className="management-section danger-section">

              <h2>
                Danger Zone
              </h2>

              <p>
                Permanently delete this ticket.
                This action cannot be undone.
              </p>


              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Delete Ticket"}
              </button>

            </section>

          </div>

        </div>

      </div>

    </PageContainer>
  );
}


export default AdminTicketDetails;