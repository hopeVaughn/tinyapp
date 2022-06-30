# tinyApp

A small nodejs/expressjs server application that lets a user create unique short URL's.

## Purpose

This project was created by me, Hope! as part of my learnings at Lighthouse Labs.

## Final Product

!["landing urls page"]('https://github.com/hopeVaughn/tinyapp/blob/master/landing.png')
!["Register Page"]('https://github.com/hopeVaughn/tinyapp/blob/master/register.png?raw=true')
!["Login Page"]('https://github.com/hopeVaughn/tinyapp/blob/master/login.png?raw=true')
!["Create short URL"]('https://github.com/hopeVaughn/tinyapp/blob/master/create.png?raw=true')
!["Client specific URL page"]('https://github.com/hopeVaughn/tinyapp/blob/master/savedURLS.png?raw=true')

## Getting Started

- tinyApp repo can be found at `https://github.com/hopeVaughn/tinyapp`
- Run the node server by useing `node express_server.js`
- Open your web browser to `http://localhost:8080/urls`
- Register as many new user e-mail and password as you'd like. Each user will have their own specific short urls data
- Create your very own short URL's
- Anyone on the local host can access the created short URL's by going to `http://localhost:8080/u/:shortURL`

## Included Files

- express_server.js `creates a server for tinyApp to run`
- helpers.js `modularized helper function file`
- package.json `npm initialized json file`
- package-lock.json `info on dependecies`
- \_header.ejs `header ejs file for html rendering`
- urls_index.ejs `html page for created short urls`
- urls_login.ehs `html page for login`
- urls_new `html page for creating a new shot URL`
- urls_register.ejs `html page for registering a new account`
- urls_show.ejs `html page to show connection between short and long URL's`
