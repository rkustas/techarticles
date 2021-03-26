import Link from "next/link";
import { useRouter } from "next/router";
import CartIcon from "../components/cart/carticon";
import { removeLocalStorage, removeCookie } from "../helpers/auth";
import { useContext } from "react";
import { ProductContext } from "../components/context/globalstate";
import { API } from "../config";
import Cookie from "js-cookie";

const Nav = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { auth } = state;
  // console.log(auth);
  const router = useRouter();
  const isActive = (r) => {
    if (r === router.pathname) {
      return " active";
    } else {
      return "";
    }
  };

  const handleLogout = () => {
    // Clear information from localstorage and cookie
    removeLocalStorage("user");
    removeCookie("token");
    Cookie.remove("refreshToken", { path: `${API}/createToken` });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "Logged out!" } });

    // Redirect
    return router.push("/");
  };

  const adminRouter = () => {
    return (
      <>
        <Link href="/admin">
          <a className="dropdown-item">Dashboard</a>
        </Link>
        <Link href="/users">
          <a className="dropdown-item">Users</a>
        </Link>
        <Link href="/create">
          <a className="dropdown-item">Products</a>
        </Link>
        <Link href="/categories">
          <a className="dropdown-item">Categories</a>
        </Link>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img
            src={auth.user.avatar}
            alt={auth.user.avatar}
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              transform: "translateY(-3px)",
              marginRight: "3px",
            }}
          />{" "}
          {auth.user.name}
        </a>

        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <Link href="/user">
            <a className="dropdown-item">Profile</a>
          </Link>
          <Link href="/orders">
            <a className="dropdown-item">Orders</a>
          </Link>
          {auth.user.role === "admin" && adminRouter()}
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </li>
    );
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
        <ul className="navbar-nav p-1">
          <li className="nav-item">
            <a className="nav-link" href="/postshome">
              Posts/Links
            </a>
          </li>
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
          {Object.keys(auth).length === 0 ? (
            <>
              <li className="nav-item">
                <Link href="/login">
                  <a className={"nav-link" + isActive("/login")}>
                    <i className="fas fa-user" aria-hidden="true"></i> Login
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/register">
                  <a className={"nav-link" + isActive("/register")}>Register</a>
                </Link>
              </li>
            </>
          ) : (
            loggedRouter()
          )}
          {/* {process.browser && auth.user && auth.user.role === "admin" && (
            <>
              <div className="avatar">
                <img
                  src={auth.user.avatar}
                  alt={auth.user.avatar}
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
                  {auth.user.name}
                </a>
                <div
                  className="dropdown-menu"
                  style={{ marginLeft: "-5rem" }}
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link href="/admin">
                    <a className="dropdown-item">Admin Dashboard</a>
                  </Link>
                  <Link href="/user">
                    <a className="dropdown-item">Profile</a>
                  </Link>
                  <Link href="/orders">
                    <a className="dropdown-item">Orders</a>
                  </Link>
                  <div className="dropdown-divider"></div>
                  {auth.user && (
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
          {process.browser && auth.user && auth.user.role === "subscriber" && (
            <>
              <div className="avatar">
                <img
                  src={auth.user.avatar}
                  alt={auth.user.avatar}
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
                  {auth.user.name}
                </a>
                <div
                  className="dropdown-menu"
                  style={{ marginLeft: "-3rem" }}
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <Link href="/user">
                    <a className="dropdown-item">Dashboard</a>
                  </Link>
                  <Link href="/orders">
                    <a className="dropdown-item">Orders</a>
                  </Link>
                  <div className="dropdown-divider"></div>
                  {auth.user && (
                    <button className="dropdown-item" onClick={logout}>
                      Logout
                    </button>
                  )}
                </div>
              </li>
            </>
          )}
          {process.browser && !auth.user && (
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
          )} */}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
