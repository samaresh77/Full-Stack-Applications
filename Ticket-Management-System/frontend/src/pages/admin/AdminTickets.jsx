import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import PageContainer from "../../components/PageContainer";


function AdminTickets() {
  const [tickets, setTickets] =
    useState([]);

  const [searchInput, setSearchInput] =
    useState("");

  const [statusInput, setStatusInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      const response =
        await api.get(
          "/admin/tickets",
          { params }
        );

      setTickets(response.data);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load tickets."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTickets();
  }, [search, status]);


  const handleApplyFilters =
    (event) => {
      event.preventDefault();

      setSearch(searchInput);
      setStatus(statusInput);
    };


  const handleClearFilters = () => {
    setSearchInput("");
    setStatusInput("");

    setSearch("");
    setStatus("");
  };


  return (
    <PageContainer>

      <div className="page-header">

        <div>

          <h1>
            All Tickets
          </h1>

          <p>
            Search and manage every support ticket.
          </p>

        </div>

      </div>


      <div className="card filter-card">

        <form
          className="filter-form"
          onSubmit={handleApplyFilters}
        >

          <div className="filter-group">

            <label>
              Search
            </label>

            <input
              className="form-control"
              type="text"
              placeholder="Title or username..."
              value={searchInput}
              onChange={(event) =>
                setSearchInput(
                  event.target.value
                )
              }
            />

          </div>


          <div className="filter-group">

            <label>
              Status
            </label>

            <select
              className="form-control"
              value={statusInput}
              onChange={(event) =>
                setStatusInput(
                  event.target.value
                )
              }
            >

              <option value="">
                All Statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Closed">
                Closed
              </option>

            </select>

          </div>


          <button
            className="btn btn-primary"
            type="submit"
          >
            Apply
          </button>


          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleClearFilters}
          >
            Clear
          </button>

        </form>

      </div>


      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      <div className="card">

        {loading ? (

          <div className="loading">
            Loading tickets...
          </div>

        ) : tickets.length === 0 ? (

          <div className="empty-state">

            <h3>
              No tickets found
            </h3>

            <p>
              Try changing your search
              or status filter.
            </p>

          </div>

        ) : (

          <>

            <div className="card-header">

              <h2>
                {tickets.length} Ticket
                {tickets.length !== 1
                  ? "s"
                  : ""}
              </h2>

            </div>


            <div className="table-wrapper">

              <table className="ticket-table">

                <thead>

                  <tr>
                    <th>Ticket</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>

                </thead>


                <tbody>

                  {tickets.map(
                    (ticket) => (

                      <tr
                        key={ticket.id}
                      >

                        <td>

                          <div className="ticket-title">
                            {ticket.title}
                          </div>

                          <small>
                            #{ticket.id}
                          </small>

                        </td>


                        <td>
                          User #
                          {ticket.created_by}
                        </td>


                        <td>
                          <StatusBadge
                            status={
                              ticket.status
                            }
                          />
                        </td>


                        <td>

                          <Link
                            className="table-action"
                            to={`/admin/tickets/${ticket.id}`}
                          >
                            View Details
                          </Link>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>

    </PageContainer>
  );
}


export default AdminTickets;