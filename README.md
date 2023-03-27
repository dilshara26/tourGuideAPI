# Natours Application

This full stack web application is specially designed for persons who love travelling and going on tour vacations.



## Overview

This web application allows it's users to book tour vacations.

A tour refers to a series of locations, specially picked to excite the adventurous spirit of the individual who books it.

A visiting user who has not yet created an account on the app can simply see all the current tours as well as detailed information about each tour.

Once signed up or logged in, they can then book any tour of their choice.

Users can write only one review for any tour they book.

## Purpose

This app is a pet project, built for the express purpose of honing my skills in full stack web development.

## Demonstration

#### Home Page :

<!-- ![natoursHomePage](https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Home.png | width=640) -->
<img src="https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Home.png" width="640">

#### Tour Details :

![tourOverview](https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Booked-Tour.gif)

#### Payment Process :

<!-- ![paymentprocess](https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Payment.png | width=640) -->
<img src="https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Payment.png" width="640">

#### LOGIN PAGE :

<!-- ![login](https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Login.png | width=640) -->
<img src="https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Login.png" width="640">

#### User Profile :

<!-- ![userprofile](https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Admin.png | width=640) -->
<img src="https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Admin.png" width="640">

## Main Tools And Technologies Used

- HTML (Create the structure and content of the web pages).
- CSS (Styling of the web pages).
- PUG (Template engine for generating the web pages dynamically).
- JAVASCRIPT (Interactivity, as well as making requests to the API from the client-side).
- NODE (Run JavaScript code on the server-side).
- EXPRESS (Node framework, meant to simplify the process of building complex server-side applications).
- MONGODB (Database for data persistence).
- MONGOOSE (Interacting with mongodb).
- MAPBOX (Displaying the different locations of each tour).
- STRIPE (Making payments on the app).
- JSON WEB TOKEN (Authenticating users)
- NODEMAILER (Sending emails to users of the app)
- MAILTRAP (Trapping the emails we send in our development environment, so they don't actually get sent to the user's email address)
- SENDGRID (Sending actual emails to the users in production).



#### Demo-`.env` file :

<!-- ![demo-env](https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Demo-env.png | width=640) -->
<img src="https://github.com/NachiketaDhal/Natours-API/blob/master/public/Screenshots/Demo-env.png" width="640">

## Main Features

- [Users](#users)
- [Tours](#tours)
- [Bookings](#bookings)
- [Reviews](#reviews)
- [Favorite Tours](#favorite-tours)
- [Notice](#notice)

## Users

- Users can sign up with the application.
- Users can log into the application.
- Users can log out of the appication.
- Users can update their password.
- Users can reset their password
- Users can update their general information.
- Users can see their profile page.
- A user can be either a regular user or an admin or a lead-guide or a guide.
- When you sign up, you are a regular user by default.

## Tours

- Tours can be created by an admin user or a lead-guide.
- Tours can be seen by every user.
- Tours can be updated by an admin user or a lead-guide.
- Tours can be deleted by an admin user or a lead-guide.

## Bookings

- Only regular users can book tours (make a payment).
- Regular users can not book thesame tour twice.
- Regular users can see all the tours thay have booked.
- An admin user or a lead-guide can see every booking on the app.
- An admin user or a lead-guide can delete any booking.
- An admin user or a lead-guide can create a booking (manually, without payment).
- An admin user or a lead-guide can not create a bookng for thesame user twice.
- An admin user or a lead-guide can edit any booking.

## Reviews

- Only regular users can write reviews for tours which they have booked.
- All users can see the reviews of each tour.
- Regular users can edit and delete their own reviews.
- Regular users can not review thesame tour twice.
- An admin can delete any review.

## Favorite Tours

- A regular user can add any of their booked tours to their list of favorite tours.
- A regular user can remove a tour from their list of favorite tours.
- A regular user can not add a tour to their list of favorite tours, when it is already a favorite.


