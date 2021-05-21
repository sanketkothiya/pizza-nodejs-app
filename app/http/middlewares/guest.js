function guest (req, res, next) {
    // passport method for chek to user login or not
    if(!req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')
}

module.exports = guest