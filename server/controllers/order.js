const Order = require("../models/order");
const Store = require("../models/store");

exports.create = async (req, res) => {
  try {
    const { address, mobile, cart, total } = req.body;
    // console.table({ address, mobile, cart, total });
    // Using let because the Order is changing and updating, can't use const
    let order = new Order({
      address,
      mobile,
      cart,
      total,
    });

    // User for order
    order.user = req.user._id;

    // Filter and update sold
    cart.filter((item) => {
      // console.log(item._id, item.count, item.inStock, item.sold);
      // console.log(sold(item._id, item.count, item.inStock, item.sold));
      return soldUpdate(item._id, item.count, item.inStock, item.sold);
    });

    // console.log(order);

    // Save the order
    await order.save();

    res.json({
      msg: "Payment success!  We will contact you to confirm the order.",
      order,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

// Shortcut sold function
const soldUpdate = async (id, count, oldInStock, oldSold) => {
  await Store.findOneAndUpdate(
    { _id: id },
    {
      inStock: oldInStock - count,
      sold: count + oldSold,
    },
    { new: true }
  ).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error updating store",
      });
    }
    console.log(data);
  });
};

exports.list = (req, res) => {
  // List all the orders
  Order.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Orders could not load",
      });
    }
    res.json(data);
  });
};
