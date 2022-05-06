// ==========  server.js ==============
// Requirements
const mongoose = require('mongoose')
const express = require('express')
const formidableMiddleware = require('express-formidable');
const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('admin-bro-expressjs')

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require('admin-bro-mongoose'))

// express server definition
const app = express()
app.use(formidableMiddleware());

// Resources definitions
const User = mongoose.model('User', { name: String, email: String, surname: String })

// Routes definitions
app.get('/', (req, res) => res.send('Hello World!'))

// Route which returns last 100 users from the database
app.get('/users', async (req, res) => {
    const users = await User.find({}).limit(10)
    res.send(users)
})

// Route which creates new user
app.post('/users', async (req, res) => {
    const user = await new User(req.fields.user).save()
    res.send(user)
})

// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
    resources: [User],
    rootPath: '/admin',
})

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)

// Running the server
const run = async () => {
    await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
    await app.listen(8080, () => console.log(`Example app listening on port 8080!`))
}

run()