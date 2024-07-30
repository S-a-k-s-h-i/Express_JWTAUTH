# ExpressAuth: Authentication System

This service primarily focuses on authentication and authorization. It features private and protected routes that are accessible only to authenticated users using JWT for authentication. Routes include registration, login, user profile management, password change, and password reset.

- Provides the user with the flexibility to reset the password if forgotten-
  - User will receive a link to reset the password in email.
  - When user clicks on the link FE should open a form and sends the password,confirm_password to reset the password.

- `Authentication`: It is a process by which we can uniquely identify users on our application. This process tells about who the user is.

- `Authorization`: It is a process by which we can identify the capabilities of a user i.e what a user can do in our application.
  Eg, we use Flipkart so when logging in as a normal user you have different access and when you log in as a seller it's different, a seller can sell the products on the app, not the normal user.
    .

## Project Setup

- clone the project on your local
  - git clone `https://github.com/S-a-k-s-h-i/Express_JWTAUTH.git`
- Execute `npm install` on the same as of your root directory of the downloaded project.
- Create a `.env` file in the root directory and add the environment variables same as mentioned in .env.example file with the values.
- For Nodemailer, to send emails create account in Ethereal, fake SMTP server and add the creds in env file

- Once you have added all the values in env file 
- Then execute to run the project
  - `npm run dev`

##DB Design

- User Table - name,email,password,tc


