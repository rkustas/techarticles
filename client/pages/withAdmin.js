import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";
// Function to wrap pages in user access only
const withAdmin = (Page) => {
  const WithAdminUser = (props) => <Page {...props} />;
  WithAdminUser.getInitialProps = async (context) => {
    // Get the token from the cookie
    const token = getCookie("token", context.req);
    // Set user to null
    let user = null;
    let userLinks = [];

    if (token) {
      try {
        // If there is a token make a request and store response data in user
        const response = await axios.get(`${API}/admin`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        user = response.data.user;
        userLinks = response.data.links;
      } catch (error) {
        // If there is an error then set user to null
        if (error.response.status === 401) {
          user = null;
        }
      }
    }

    if (user === null) {
      // redirect if the user isn't an admin
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      // Otherwise return the context and page props, token
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
        userLinks,
      };
    }
  };

  return WithAdminUser;
};

export default withAdmin;
