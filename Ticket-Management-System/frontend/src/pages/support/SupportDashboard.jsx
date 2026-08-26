import { Link } from "react-router-dom";
import MyTickets from "./MyTickets";
import PageContainer from "../../components/PageContainer";


function SupportDashboard() {
  return (
    <PageContainer>

      <div className="page-header">

        <div>
          <h1>
            My Tickets
          </h1>

          <p>
            View and manage your support requests.
          </p>
        </div>


        <div className="page-actions">

          <Link
            to="/support/create"
            className="btn btn-primary"
          >
            + Create Ticket
          </Link>

        </div>

      </div>


      <MyTickets />

    </PageContainer>
  );
}


export default SupportDashboard;