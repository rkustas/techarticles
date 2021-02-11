import withAdmin from "../../withAdmin";
import Link from "next/link";
import { useContext } from "react";
import Head from "next/head";
import { ProductContext } from "../../../components/context/globalstate";

// With Admin returns user and token props
const Read = ({ user, token }) => {
  const { state, dispatch } = useContext(ProductContext);
  const { artCategories } = state;
  // console.log(artCategories);

  const listCategories = () =>
    artCategories.map((c, i) => (
      <div
        style={{ border: "1px solid black" }}
        className="bg-light p-3 col-md-6"
        key={c._id}
      >
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
            <Link href={`/links/${c.slug}`}>
              <button className="btn btn-sm btn-outline-info btn-block">
                View
              </button>
            </Link>
            <Link href={`/admin/category/${c.slug}`}>
              <button className="btn btn-sm btn-outline-dark btn-block">
                Update
              </button>
            </Link>
            {/* Use arrow function so function doesn't run here */}
            <button
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={() =>
                dispatch({
                  type: "ADD_MODAL",
                  payload: [
                    {
                      data: artCategories,
                      id: c._id,
                      name: c.name,
                      slug: c.slug,
                      type: "ADD_ARTICLE_CAT",
                    },
                  ],
                })
              }
              className="btn btn-sm btn-outline-danger btn-block"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ));

  return (
    <>
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
    </>
  );
};

export default withAdmin(Read);
