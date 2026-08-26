import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import PageContainer from "../../components/PageContainer";


function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchTicket = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/tickets/${id}`);

            setTicket(response.data);
        } catch (error) {
            console.error(error);

            if (error.response?.status === 404) {
                setError("Ticket not found.");
            } else {
                setError("Failed to load ticket.");
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTicket();
    }, [id]);


    if (loading) {
        return <p>Loading ticket...</p>;
    }


    if (error) {
        return (
            <div>
                <p>{error}</p>

                <Link to="/support">
                    Back to My Tickets
                </Link>
            </div>
        );
    }


    if (!ticket) {
        return null;
    }

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this ticket?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/tickets/${id}`);

            navigate("/support");

        } catch (error) {
            console.error(error);

            if (error.response?.status === 400) {
                setError(
                    error.response.data.detail ||
                    "Only open tickets can be cancelled."
                );
            } else if (error.response?.status === 404) {
                setError("Ticket not found.");
            } else {
                setError("Failed to cancel ticket.");
            }
        }
    };


    return (
        <PageContainer>

  <Link
    to="/support"
    className="back-link"
  >
    ← Back to My Tickets
  </Link>


  <div className="ticket-detail-card card">

    <div className="ticket-detail-header">

      <h1>
        {ticket.title}
      </h1>

      <StatusBadge
        status={ticket.status}
      />

    </div>


    <div className="ticket-detail-body">

      <h3>
        Description
      </h3>

      <div className="ticket-description">
        {ticket.description}
      </div>


      <div className="detail-grid">

        <div className="detail-item">

          <span className="detail-label">
            Status
          </span>

          <StatusBadge
            status={ticket.status}
          />

        </div>


        <div className="detail-item">

          <span className="detail-label">
            Assigned To
          </span>

          <span className="detail-value">
            {ticket.assigned_to
              ? `User #${ticket.assigned_to}`
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
            Updated
          </span>

          <span className="detail-value">
            {new Date(
              ticket.updated_at
            ).toLocaleString()}
          </span>

        </div>

      </div>


      {ticket.status === "Open" && (

        <div className="form-actions">

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/support/tickets/${id}/edit`
              )
            }
          >
            Edit Ticket
          </button>


          <button
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Cancel Ticket
          </button>

        </div>

      )}

    </div>

  </div>

</PageContainer>
    );
}


export default TicketDetails;