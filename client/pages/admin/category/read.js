import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import axios from "axios";
import Link from "next/link";
import { API } from "../../../config";
import { useEffect, useState } from "react";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Head from "next/head";

// With Admin returns user and token props
const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: [],
  });

  const { error, success, categories } = state;

  // dont need server side rendering first
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    //   Get all the categories
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, categories: response.data });
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    // Browser alert to inform user
    let answer = window.confirm(`Are you sure you want to delete ${slug}?`);
    if (answer) {
      // Send request to server to delete
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        // Only authorized user can delete
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Category delete success", response);
      loadCategories();
    } catch (error) {
      console.log("Category delete", error);
    }
  };

  const listCategories = () =>
    categories.map((c, i) => (
      <Link href={`/links/${c.slug}`} key={c._id}>
        <a
          style={{ border: "1px solid black" }}
          className="bg-light p-3 col-md-6"
        >
          <div>
            <div className="row">
              <div className="col-md-3">
                <img
                  src={c.image.url}
                  alt={c.name}
                  style={{ width: "125px", height: "auto" }}
                  className="pr-3"
                />
              </div>
              <div className="col-md-6">
                <h3>{c.name}</h3>
              </div>
              <div className="col-md-3">
                <Link href={`/admin/category/${c.slug}`}>
                  <button className="btn btn-sm btn-outline-dark btn-block">
                    Update
                  </button>
                </Link>
                {/* Use arrow function so function doesn't run here */}
                <button
                  onClick={(e) => confirmDelete(e, c.slug)}
                  className="btn btn-sm btn-outline-danger btn-block"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <Layout>
      <div>
        <Head>
          <title>Category List</title>
        </Head>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h1>List of Categories</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

export default withAdmin(Read);
