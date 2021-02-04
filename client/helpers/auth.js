import cookie from "js-cookie";
import Router from "next/router";

// Set the cookie
export const setCookie = (key, value) => {
  // Like if window, we can access all properties of browser page
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// Remove from cookie

export const removeCookie = (key) => {
  // Like if window, we can access all properties of browser page
  if (process.browser) {
    cookie.remove(key);
  }
};

// Get the cookie, stored token, useful when we need to make request to server with auth token

export const getCookie = (key, req) => {
  // Get the cookie regardless of whether we are on the client side of the server side
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
  // if (process.browser) {
  //   return cookie.get(key);
  // }
};
// Get cookie from client side
export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

// Get cookie from server side
export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  console.log("req.headers.cookie", req.headers.cookie);
  let token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  // Has the actual token
  let tokenValue = token.split("=")[1];

  console.log("getCookieFromServer", tokenValue);
  return tokenValue;
};

// Set in localstorage

export const setLocalStorage = (key, value) => {
  if (process.browser) {
    // Set by passing in a key and json string of values
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Remove from localstorage

export const removeLocalStorage = (key) => {
  if (process.browser) {
    // Remove by passing in key
    localStorage.removeItem(key);
  }
};

// Authenticate user by passing data to cookie and localstorage during signin
// Response coming from successful user login, redirect in callback function
export const authenticate = (response, next) => {
  // Run set cookie and store cookie
  setCookie("token", response.data.token);
  // Run setlocalStorage to store user data
  setLocalStorage("user", response.data.user);
  // Redirect
  next();
};

// Last, access user information from localstorage

export const isAuth = () => {
  if (process.browser) {
    // Make sure we have token
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      // Check local Storage
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const logout = () => {
  // Clear information from localstorage and cookie
  removeLocalStorage("user");
  removeCookie("token");

  // Redirect
  Router.push("/");
};

export const updateUser = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      let auth = JSON.parse(localStorage.getItem("user"));
      auth = user;
      localStorage.setItem("user", JSON.stringify(auth));
      next();
    }
  }
};
