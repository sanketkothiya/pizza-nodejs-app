const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController() {
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next)
         {
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            // strategy local here we use
            passport.authenticate('local', (err, user, info) => {

                // data come through passport.js 
                // message is a kry
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req, res, next)  //return function call here
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
         const { name, email, password }   = req.body
         // Validate request 
        //  console.log(req.body);
         if(!name || !email || !password) {
             req.flash('error', 'All fields are required')
             req.flash('name', name)
             req.flash('email', email)
            return res.redirect('/register')
         }

         // Check if email exists 
         User.exists({ email: email }, (err, result) => {
             if(result) {
                req.flash('error', 'Email already taken')
                req.flash('name', name)
                req.flash('email', email) 
                return res.redirect('/register')
             }
         }) 

         // Hash password 
         const hashedPassword = await bcrypt.hash(password, 10)
         // Create a user 
         const user = new User({
            //  also write singe like name
             name:name,
             email:email,
             password: hashedPassword
         })

         user.save().then((user) => {
            // Login
            return res.redirect('/')
         }).catch(err => {
            req.flash('error', 'Something went wrong')
                return res.redirect('/register')
         })
        },
        logout(req, res) {
          req.logout()
          return res.redirect('/login')  
        }
    }
}

module.exports = authController