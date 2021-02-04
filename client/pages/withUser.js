import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";
// Function to wrap pages in user access only
const withUser = (Page) => {
  const WithAuthUser = (props) => <Page {...props} />;
  WithAuthUser.getInitialProps = async (context) => {
    // Get the token from the cookie
    const token = getCookie("token", context.req);
    // Set user to null
    let user = null;
    // Bring in userLinks props
    let userLinks = [];
    // Bring in userOrders props
    let userOrders = [];

    if (token) {
      try {
        // If there is a token make a request and store response data in user
        const response = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        console.log("response in WithUser", response);
        user = response.data.user;
        userLinks = response.data.links;
        userOrders = response.data.orders;
      } catch (error) {
        // If there is an error then set user to null
        if (error.response.status === 401) {
          user = null;
        }
      }
    }

    if (user === null) {
      // redirect if there isn't a user
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
        userOrders,
      };
    }
  };

  return WithAuthUser;
};

export default withUser;
