import Document, { Html, Head, Main, NextScript } from "next/document";
import { PAYPAL_CLIENT_ID } from "../config";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Ryan Kustas Projects" />
          <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
          <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"
            integrity="sha384-q2kxQ16AaE6UbzuKqyBE9/u/KzioAlnx2maXQHiDX9d4/zp8Ok3f+M7DPm+Ib6IU"
            crossorigin="anonymous"
          ></script>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.min.js"
            integrity="sha384-pQQkAEnwaBkjpqZ8RU1fF1AKtTcHJwFl3pblpTlHXybJjHpMYo79HY3hIi4NKxyj"
            crossorigin="anonymous"
          ></script>
          <script src="https://kit.fontawesome.com/a076d05399.js"></script>
          <script
            src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}`}
          ></script>

          {/* Import styles */}
          <link rel="stylesheet" href="/static/css/styles.css" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          ></link>
          <link
            rel="canonical"
            href="https://getbootstrap.com/docs/4.3/components/dropdowns/"
          ></link>
        </Head>
        <Main />
        <NextScript />
      </Html>
    );
  }
}
export default MyDocument;
