import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import PageContainer from "../../components/PageContainer";


function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/tickets", {
        title,
        description,
      });

      navigate("/support");

    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        setError(
          "Please provide a valid title and description."
        );
      } else {
        setError(
          "Unable to create the ticket."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <PageContainer>

      <div className="form-page">

        <Link
          to="/support"
          className="back-link"
        >
          ← Back to My Tickets
        </Link>


        <div className="page-header">

          <div>
            <h1>
              Create Ticket
            </h1>

            <p>
              Tell us what you need help with.
            </p>
          </div>

        </div>


        <div className="card">

          <div className="form-card">

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label htmlFor="title">
                  Title
                </label>

                <input
                  id="title"
                  className="form-control"
                  type="text"
                  placeholder="e.g. Internet connection problem"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  className="form-control"
                  placeholder="Describe the problem in detail..."
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="form-actions">

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create Ticket"}
                </button>


                <Link
                  to="/support"
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


export default CreateTicket;