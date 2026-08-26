import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar() {
  const { user, logout } = useAuth();


  if (!user) {
    return null;
  }


  return (
    <nav className="navbar">

      <div>
        <Link
          to={
            user.role === "admin"
              ? "/admin"
              : "/support"
          }
          className="navbar-brand"
        >
          Mini Helpdesk
        </Link>
      </div>


      <div className="navbar-links">

        {user.role === "admin" ? (
          <>
            <Link to="/admin">
              Dashboard
            </Link>

            <Link to="/admin/tickets">
              Tickets
            </Link>
          </>
        ) : (
          <>
            <Link to="/support">
              My Tickets
            </Link>

            <Link to="/support/create">
              Create Ticket
            </Link>
          </>
        )}


        <span>
          {user.username}
        </span>


        <button onClick={logout}>
          Logout
        </button>

      </div>

    </nav>
  );
}


export default Navbar;