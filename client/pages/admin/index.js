// /admin endpoint

import Layout from "../../components/layout";
import withAdmin from "../withAdmin";
import Link from "next/link";
import Head from "next/head";

const Admin = ({ user }) => (
  <Layout>
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
              <a className="nav-link">All Categories</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/admin/link/read">
              <a className="nav-link">All Links</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/user/profile/update">
              <a className="nav-link">Update Profile</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="col-md-8"></div>
    </div>
  </Layout>
);

export default withAdmin(Admin);
