export const ACTIONS = {
  NOTIFY: "NOTIFY",
  AUTH: "AUTH",
  ADD_CART: "ADD_CART",
  ADD_MODAL: "ADD_MODAL",
};

export const addToCart = (product, cart) => {
  const check = cart.every((item) => {
    return item._id !== product._id;
  });

  if (!check) {
    return {
      type: "NOTIFY",
      payload: { error: "The product has already been added to cart." },
    };
  }

  return {
    type: "ADD_CART",
    payload: [...cart, { ...product, count: 1, inCart: true }],
  };
};

export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) {
      item.count -= 1;
    }
  });
  return { type: "ADD_CART", payload: newData };
};

export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) {
      item.count += 1;
    }
  });
  return { type: "ADD_CART", payload: newData };
};

export const deleteItem = (data, id, type) => {
  const newData = data.filter((item) => item._id !== id);
  return { type, payload: newData };
};