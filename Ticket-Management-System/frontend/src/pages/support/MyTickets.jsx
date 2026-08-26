import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";


function MyTickets() {
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/tickets");

      setTickets(response.data);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load your tickets."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTickets();
  }, []);


  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          Loading your tickets...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }


  if (tickets.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">

          <h3>
            No tickets yet
          </h3>

          <p>
            Create your first support ticket
            to get started.
          </p>

          <Link
            to="/support/create"
            className="btn btn-primary"
          >
            Create Ticket
          </Link>

        </div>
      </div>
    );
  }


  return (
    <div className="card">

      <div className="card-header">

        <h2>
          Your Tickets
        </h2>

      </div>


      <div className="table-wrapper">

        <table className="ticket-table">

          <thead>
            <tr>
              <th>Ticket</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>


          <tbody>

            {tickets.map((ticket) => (

              <tr key={ticket.id}>

                <td>

                  <div className="ticket-title">
                    {ticket.title}
                  </div>

                  <small>
                    #{ticket.id}
                  </small>

                </td>


                <td>
                  <StatusBadge
                    status={ticket.status}
                  />
                </td>


                <td>
                  {new Date(
                    ticket.created_at
                  ).toLocaleDateString()}
                </td>


                <td>

                  <Link
                    className="table-action"
                    to={`/support/tickets/${ticket.id}`}
                  >
                    View
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


export default MyTickets;