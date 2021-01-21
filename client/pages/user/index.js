import Layout from "../../components/layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { useState } from "react";
import moment from "moment";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import withUser from "../withUser";
import Head from "next/head";

const User = ({ user, userLinks, token }) => {
  const initialState = {
    links: userLinks,
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
  };

  const [data, setData] = useState(initialState);
  const { links, avatar, name, password, cf_password } = data;

  // console.log(user);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete > ', slug);
    let answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    console.log("delete link > ", id);
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LINK DELETE SUCCESS ", response);
      Router.replace("/user");
    } catch (error) {
      console.log("LINK DELETE ", error);
    }
  };

  const handleClick = async (linkId) => {
    // Put because we are updating the links
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.get(`${API}/user`, {
      headers: {
        authorization: `Bearer ${token}`,
        contentType: "application/json",
      },
    });
    setAllLinks(response.data.links);
  };

  const listOfLinks = () =>
    links.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>

        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}
            </span>
          ))}
          <span className="badge text-secondary">{l.clicks} clicks</span>

          <Link href={`/user/link/${l._id}`}>
            <span className="badge text-blue pull-right">Update</span>
          </Link>

          <span
            onClick={(e) => confirmDelete(e, l._id)}
            className="badge text-danger pull-right"
          >
            Delete
          </span>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div>
        <Head>
          <title>User Profile</title>
        </Head>
      </div>
      <h1>
        {user.name}'s dashboard{" "}
        <span className="text-warning">/{user.role}</span>
      </h1>
      <hr />

      <section
        className="row p-2 bg-light"
        style={{ border: "1px solid black" }}
      >
        <div className="col-md-4">
          <h3 className="text-center text-uppercase">profile</h3>
          <div className="avatar text-center">
            <img src={user.avatar} alt={user.avatar} />
          </div>
          <div className="nav flex-column text-center">
            <div>
              <Link href="/user/link/create">
                <button className="btn btn-primary">Submit a link</button>
              </Link>
            </div>
            <div className="mt-2">
              <Link href="/user/profile/update">
                <button className="btn btn-secondary">Update Profile</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h3 className="text-center text-uppercase">Your links</h3>
          <br />
          {listOfLinks()}
          <div>
            <h3 className="text-center text-uppercase">orders</h3>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default withUser(User);
