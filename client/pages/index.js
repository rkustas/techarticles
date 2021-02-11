import Layout from "../components/layout";
import axios from "axios";
import { API } from "../config";
import Link from "next/link";
import { useEffect, useState } from "react";
import moment from "moment";
import Head from "next/head";

// Props can be passed down and made available through the function below
const Home = ({ categories }) => {
  // console.log(categories);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    // Load popular posts
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    // Put because we are updating the links
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  };

  // console.log(popular);

  const listOfLinks = () =>
    popular.map((l, i) => (
      <div className="row alert alert-secondary p-2" key={i}>
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>
        <div className="col">
          <span className="badge text-dark">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
          <span className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
      </div>
    ));

  // show each category and image
  const listCategories = () =>
    categories.map((c, i) => (
      <Link href={`/links/${c.slug}`} key={c._id}>
        <a
          style={{ border: "1px solid black" }}
          className="p-3 col-md-4 bg-light"
        >
          <div>
            <div className="row">
              <div className="col-md-4">
                <img
                  src={c.image.url}
                  alt={c.name}
                  style={{ width: "125px", height: "auto" }}
                  className="pr-5"
                />
              </div>
              <div className="col-md-8">
                <h3 className="overflow-hidden">{c.name}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));
  if (popular.length === 0) return null;

  return (
    <>
      <div>
        <Head>
          <title>Home</title>
        </Head>
      </div>
      <div>
        <div className="row">
          <div className="col-md-12">
            <h1 className="font-weight-bold">
              Browse Tutorials/Course
              <br />
            </h1>
          </div>
        </div>
        <div className="row overflow-hidden">{listCategories()}</div>
      </div>
      <div className="row pt-5">
        <h2 className="font-weight-bold pb-3">Trending</h2>
        <div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
      </div>
    </>
  );
};

// Get props to load all categories, use get Inital Props for server side rendering first
Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
