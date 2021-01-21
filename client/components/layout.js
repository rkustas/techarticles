// React Available globally, do not need to import it
import Nav from "../components/nav";
import Modal from "./modal";

// Import Bootstrap and Jquery
// At the top of _app.tsx or your individual page:
if (typeof window !== "undefined") {
  require("jquery");
  require("popper.js");
  require("bootstrap");
}

// Import progress bar to see progress of page loading, using route events methods in next.js docs
import NProgress from "nprogress";
// Import router
import Router from "next/router";
// Loading css from node module package instead of pasting the cdn in head
import "nprogress/nprogress.css";

// Bootstrap for formatting
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// Import Usestate
import { useEffect, useState } from "react";
import Notify from "./notify";

// Router function for when the route starts to change
Router.onRouteChangeStart = (url) => NProgress.start();
// Router function for when the route completes
Router.onRouteChangeComplete = (url) => NProgress.done();
// Router function for when there is an error in the route
Router.onRouteChangeError = (url) => NProgress.start();

const React = require("react");
// Layout function for navbar
const Layout = ({ children }) => {
  const [state, setState] = useState({
    offset: 0,
    scrolled: 0,
  });

  const { offset, scrolled } = state;

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let handleScroll = () => {
    setState(window.pageYOffset);
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = `${scrollPx / winHeightPx}`;
    setState({ ...state, scrolled: scrolled });
  };

  // Returning React fragment instead of div, sometimes div messes with bootstrap formatting
  return (
    <>
      <Nav />
      <Notify />
      <Modal />
      <div className="container">{children}</div>
      {/* <section
        style={{
          transform: `translateY(${offset * 0.5}px)`,
        }}
      >
        <div className="container">{children}</div>
      </section> */}
      <div id="progressBarContainer">
        <div id="progressBar" style={{ transform: `scale(${scrolled}, 1)` }} />
      </div>
    </>
  );
};

export default Layout;
