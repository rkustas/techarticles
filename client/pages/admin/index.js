// /admin endpoint

import withAdmin from "../withAdmin";
import Link from "next/link";
import Head from "next/head";

const Admin = ({ user }) => (
  <>
    <div>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
    </div>
    <h1>Admin Dashboard</h1>
    <br />
    <div
      className="row"
      style={{ backgroundColor: "whitesmoke", border: "1px solid black" }}
    >
      <div className="col-md-4">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="/admin/category/create" className="nav-link">
              Create Category
            </a>
          </li>
          <li className="nav-item">
            <Link href="/admin/category/read">
              <a className="nav-link">Article Categories</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/link/read">
              <a className="nav-link">Links</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/user">
              <a className="nav-link">Update Profile</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/users">
              <a className="nav-link">Users</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/create">
              <a className="nav-link">Create Product</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/categories">
              <a className="nav-link">Product Categories</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-md-8"></div>
    </div>
  </>
);

export default withAdmin(Admin);
