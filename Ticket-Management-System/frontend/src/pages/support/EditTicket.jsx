import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import PageContainer from "../../components/PageContainer";
import StatusBadge from "../../components/StatusBadge";


function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/tickets/${id}`);

        const ticket = response.data;

        setTitle(ticket.title);
        setDescription(ticket.description);
        setStatus(ticket.status);

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

    fetchTicket();
  }, [id]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      await api.put(`/tickets/${id}`, {
        title,
        description,
      });

      navigate(`/support/tickets/${id}`);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 400) {
        setError(
          error.response.data.detail ||
          "Only open tickets can be updated."
        );
      } else if (error.response?.status === 404) {
        setError("Ticket not found.");
      } else if (error.response?.status === 422) {
        setError(
          "Please provide a valid title and description."
        );
      } else {
        setError("Failed to update ticket.");
      }
    } finally {
      setSaving(false);
    }
  };


  // Loading state
  if (loading) {
    return (
      <PageContainer>
        <div className="loading">
          Loading ticket...
        </div>
      </PageContainer>
    );
  }


  // Ticket not found
  if (error && !title) {
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
                to="/support"
                className="btn btn-primary"
              >
                Back to My Tickets
              </Link>

            </div>

          </div>

        </div>

      </PageContainer>
    );
  }


  // Ticket is no longer editable
  if (status !== "Open") {
    return (
      <PageContainer>

        <div className="form-page">

          <Link
            to={`/support/tickets/${id}`}
            className="back-link"
          >
            ← Back to Ticket
          </Link>


          <div className="card">

            <div className="empty-state">

              <h3>
                Ticket cannot be edited
              </h3>

              <p>
                This ticket is currently:
              </p>

              <p>
                <StatusBadge status={status} />
              </p>

              <p>
                Only Open tickets can be updated.
              </p>


              <Link
                to={`/support/tickets/${id}`}
                className="btn btn-primary"
              >
                Back to Ticket
              </Link>

            </div>

          </div>

        </div>

      </PageContainer>
    );
  }


  // Main edit page
  return (
    <PageContainer>

      <div className="form-page">

        {/* Back navigation */}

        <Link
          to={`/support/tickets/${id}`}
          className="back-link"
        >
          ← Back to Ticket
        </Link>


        {/* Page header */}

        <div className="page-header">

          <div>

            <h1>
              Edit Ticket
            </h1>

            <p>
              Update the details of your support request.
            </p>

          </div>


          <StatusBadge status={status} />

        </div>


        {/* Form card */}

        <div className="card">

          <div className="form-card">

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* Title */}

              <div className="form-group">

                <label htmlFor="ticket-title">
                  Ticket Title
                </label>

                <input
                  id="ticket-title"
                  className="form-control"
                  type="text"
                  value={title}
                  placeholder="Enter ticket title"
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  required
                />

                <small
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  Give your support request a short,
                  descriptive title.
                </small>

              </div>


              {/* Description */}

              <div className="form-group">

                <label htmlFor="ticket-description">
                  Description
                </label>

                <textarea
                  id="ticket-description"
                  className="form-control"
                  value={description}
                  placeholder="Describe your problem in detail..."
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  required
                />

                <small
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  Include any information that may
                  help resolve your issue.
                </small>

              </div>


              {/* Actions */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>


                <Link
                  to={`/support/tickets/${id}`}
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>

              </div>

            </form>

          </div>

        </div>

      </div>

    </PageContainer>
  );
}


export default EditTicket;