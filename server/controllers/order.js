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
      return soldUpdate(item._id, item.quantity, item.inStock, item.sold);
    });

    // Save the order
    order.save();

    res.json({
      msg: "Order has been placed!  We will contact you to confirm the order",
      order,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

// Shortcut sold function
const soldUpdate = async (id, quantity, oldInStock, oldSold) => {
  await Store.findByIdAndUpdate(
    { _id: id },
    {
      inStock: oldInStock - quantity,
      sold: quantity + oldSold,
    },
    { new: true }
  );
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

exports.read = (req, res) => {
  const { id } = req.params;
  Order.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Error finding order",
      });
    }
    res.json(data);
  });
};

// Update payment
exports.paymentUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId } = req.body;
    await Order.findOneAndUpdate(
      { _id: id },
      {
        paid: true,
        dateOfPayment: new Date().toISOString(),
        paymentId,
        method: "Paypal",
      }
    );
    res.json({ msg: "Payment success!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update delivered status
exports.deliveredUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const order = Order.findOne({ _id: id });
    if (order.paid) {
      await Order.findOneAndUpdate(
        { _id: id },
        {
          delivered: true,
        }
      );
      res.json({
        msg: "Updated delivered status!",
        result: {
          paid: true,
          dateOfPayment: order.dateOfPayment,
          method: order.method,
          delivered: true,
        },
      });
    } else {
      await Order.findOneAndUpdate(
        { _id: id },
        {
          paid: true,
          dateOfPayment: new Date().toISOString(),
          method: "Receive Cash",
          delivered: true,
        }
      );
      res.json({
        msg: "Updated delivered status!",
        result: {
          paid: true,
          dateOfPayment: new Date().toISOString(),
          method: "Receive Cash",
          delivered: true,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
