// React Available globally, do not need to import it
import Head from "next/head";
// Doing this to give the application a single page feel
import Link from "next/link";

// Import progress bar to see progress of page loading, using route events methods in next.js docs
import NProgress from "nprogress";
// Import router
import Router from "next/router";
// Loading css from node module package instead of pasting the cdn in head
import "nprogress/nprogress.css";
// Import isAuth and logout functions
import { isAuth, logout } from "../helpers/auth";

// Router function for when the route starts to change
Router.onRouteChangeStart = (url) => NProgress.start();
// Router function for when the route completes
Router.onRouteChangeComplete = (url) => NProgress.done();
// Router function for when there is an error in the route
Router.onRouteChangeError = (url) => NProgress.start();

// Create head function to import bootstrap
const head = () => (
  <React.Fragment>
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossOrigin="anonymous"
    />

    {/* Import styles */}
    <link rel="stylesheet" href="/static/css/styles.css" />
  </React.Fragment>
);

var React = require("react");
// Layout function for navbar
const Layout = ({ children }) => {
  const nav = () => (
    <ul className="nav nav-tabs bg-dark">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-light">Home</a>
        </Link>
      </li>

      {/* Link */}
      <li className="nav-item">
        <Link href="/user/link/create">
          <a
            className="nav-link text-light btn btn-danger"
            style={{ borderRadius: "0px" }}
          >
            Submit Link
          </a>
        </Link>
      </li>

      {/* Show admin page */}
      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item ml-auto">
          <Link href="/admin">
            <a className="nav-link text-light">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {/* Show user page */}
      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item ml-auto">
          <Link href="/user">
            <a className="nav-link text-light">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {/*  */}
      {!isAuth() && (
        <React.Fragment>
          <li className="nav-item">
            <Link href="/login">
              <a className="nav-link text-light">Login</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/register">
              <a className="nav-link text-light">Register</a>
            </Link>
          </li>
        </React.Fragment>
      )}

      {isAuth() && (
        <li className="nav-item">
          <a onClick={logout} className="nav-link text-light">
            Logout
          </a>
        </li>
      )}
    </ul>
  );

  // Returning React fragment instead of div, sometimes div messes with bootstrap formatting
  return (
    <React.Fragment>
      {head()}
      {nav()} <div className="container pt-5 pb-5">{children}</div>
    </React.Fragment>
  );
};

export default Layout;
