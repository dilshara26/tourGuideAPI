# get Request
Generally the simple GET/POST/PATCH/UPDATE requests happen in a simillar order
 - first load express
 app = require('express')
 - then write the function for the given crud operation
 app.get('write the relative path', (req,res)=>{ // function statement })

 - post request would have a simillar way
 app.post('write the same pathway', (req,res)+>{//function statement })

# JOSN.parse and JSON.stringify
 - JSON.parse would convert the JSON data to a usable format in JAVASCRIPT
 - JSON.stringify will convert the Javascript object in to a JSON format

# working with res and req
REQ is used to get data from users end. RES is used to send data to users end
 - res should be passed as an JSON
 res.status(201).JSON({status:"sucessfull", data: {tours: tours}})
 - req is used to get data from the user
 let new_tour = Object.assign({id:newid},req.body)

# middleware
 - middlewares are the chunks of code run in inbetween user request and server respose
 - general declaration of a middleware is 
   app = require('express')
   app.use((req,res,next)-=>{ // function statement next()})

 - calling the next function is mandotary to move in to the next middleware
 - hierachy of the middleware is important since after a user respose nothing else would be responded to the user

# refactoring functions
 - first refactor all the functions in to one place and use them in crud methods
  app.get('/api/v1/tours', getAllTours);
  const getAllTours = (req, res)={ }

 - then we can chain the cruds that use simillar routes
  app.route('/api/v1/tours').get(getAllTours).post(updateTours)
# refactoring routes
 - finally we can keep mounting routes only in the JS and create seperate JS for routing
 - in the newly created JS for routing, import express and create routes and export the router
 Router = require('express')
 Router.route('/api/v1/tours').get(getAllTours).post(updateTours)
 module.export = Router

 # refactoring controllers
 - we can futher refactor by putting app controllers in to one folder
  since there are several exports at once, we need to add all the function to exports module
 exports.get = ()=>{ // function statement }
 exports.post = ()=>{ // function statement }
 - finally we can call these methods in the routes functions
 const controllers = require('./controllers')
 Router.route('/api/v1/tours').get(controllers.getAllTours).post(controllers.updateTours)
 




