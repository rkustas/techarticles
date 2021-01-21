import Link from "next/link";
import { useRouter } from "next/router";
import CartIcon from "../components/cart/carticon";
import { isAuth, logout } from "../helpers/auth";

const Nav = () => {
  // console.log(isAuth());
  const router = useRouter();
  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a className="navbar-brand" href="/">
        <i className="material-icons orange600">group_work</i>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbar1"
        aria-controls="navbar1"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbar1"
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/user/link/create">
              Submit Link
            </a>
          </li>
          <li className="nav-item">
            <Link href="/store">
              <a className={"nav-link" + isActive("/store")}>Store</a>
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <CartIcon />
          {process.browser && isAuth() && isAuth().role === "admin" && (
            <>
              <div className="avatar">
                <img
                  src={isAuth().avatar}
                  alt={isAuth().avatar}
                  style={{
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    transform: "translateY(-3px)",
                    marginRight: "3px",
                  }}
                />
              </div>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {isAuth().name}
                </a>
                <div
                  className="dropdown-menu"
                  style={{ marginLeft: "-3rem" }}
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link href="/user">
                    <a className="dropdown-item">Dashboard</a>
                  </Link>
                  <Link href="/user/profile/update">
                    <a className="dropdown-item">Profile</a>
                  </Link>
                  <div className="dropdown-divider"></div>
                  {isAuth() && (
                    <Link href="#">
                      <a className="dropdown-item" onClick={logout}>
                        Logout
                      </a>
                    </Link>
                  )}
                </div>
              </li>
            </>
          )}
          {process.browser && isAuth() && isAuth().role === "subscriber" && (
            <>
              <div className="avatar">
                <img
                  src={isAuth().avatar}
                  alt={isAuth().avatar}
                  style={{
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    transform: "translateY(-3px)",
                    marginRight: "3px",
                  }}
                />
              </div>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {isAuth().name}
                </a>
                <div
                  className="dropdown-menu"
                  style={{ marginLeft: "-3rem" }}
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link href="/user">
                    <a className="dropdown-item">Dashboard</a>
                  </Link>
                  <Link href="/user/profile/update">
                    <a className="dropdown-item">Profile</a>
                  </Link>
                  <div className="dropdown-divider"></div>
                  {isAuth() && (
                    <Link href="#">
                      <a className="dropdown-item" onClick={logout}>
                        Logout
                      </a>
                    </Link>
                  )}
                </div>
              </li>
            </>
          )}
          {process.browser && !isAuth() && (
            <>
              <li className="nav-item">
                <Link href="/login">
                  <a className={"nav-link" + isActive("/login")}>
                    <i className="fas fa-user">
                      <span>Login</span>
                    </i>
                  </a>
                </Link>
                <Link href="/register">
                  <a className={"nav-link" + isActive("/register")}>Register</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
