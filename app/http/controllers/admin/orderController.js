const order = require("../../../models/order")

const Order = require('../../../models/order')

function orderController() {
    return {
        index(req, res) {
            // populate use for fetching all  customerid data which we pass in populate
           order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
               if(req.xhr) {
                   return res.json(orders)
               } else {
                return res.render('admin/orders')
               }
           })
        }
    }
}

module.exports = orderController