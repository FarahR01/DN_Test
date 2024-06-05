Project Description
Project Title: Multi-Step User Registration API

Objective:
This project, developed as part of a summer internship application for a backend developer role, focuses on creating a multi-step user registration process using Node.js and Express.js. The application guides users through entering their data in four distinct steps, ultimately saving the information in a MySQL database.

Registration Steps:

Enter Full Name: Users input their full name, which is then checked for existence in the database before saving.
Enter Email: Users provide their email, which is validated and checked against existing records in the database.
Enter Phone Number: Users input their phone number, which undergoes a similar validation and existence check.
Enter Password: Users set a password, which is securely hashed before being saved. After successful registration, an authentication token (JWT) is generated, and the user session is terminated.
Technologies Used:

Node.js: JavaScript runtime environment for server-side execution.
Express.js: Web application framework for building API endpoints.
Sequelize: ORM tool for database operations with MySQL.
bcryptjs: Library for securely hashing passwords.
jsonwebtoken: Library for creating and verifying JWT tokens for user authentication.
Swagger: Tool for documenting API endpoints.

API Endpoints:

Save Full Name: /api/saveFullName

Method: POST
Description: Saves the user's full name (first name and last name).
Responses:
200: Full name saved.
400: Full name already exists.
500: Internal server error.
Save Email: /api/saveEmail

Method: POST
Description: Saves the user's email.
Responses:
200: Email saved.
400: Email already exists or user ID not found in session.
500: Internal server error.
Save Phone Number: /api/savePhone

Method: POST
Description: Saves the user's phone number.
Responses:
200: Phone number saved.
400: Phone number already exists or user ID not found in session.
500: Internal server error.
Save Password: /api/savePassword

Method: POST
Description: Saves the user's password and creates a JWT token.
Responses:
200: Password saved and token created.
400: User ID not found in session.
500: Internal server error.
How the Code Works:

saveFullName:

Checks if the provided first and last name already exist in the database.
If not, it creates a new user with the provided names and stores the user data in the session.
saveEmail:

Checks if the provided email already exists in the database.
If not, it updates the current user's email in the session and the database.
savePhone:

Checks if the provided phone number already exists in the database.
If not, it updates the current user's phone number in the session and the database.
savePassword:

Hashes the provided password using bcrypt.
Updates the current user's password in the database.
Generates a JWT token for the user and destroys the session, clearing the session cookie.
Summary:

Technologies: Node.js, Express.js, Sequelize, bcryptjs, jsonwebtoken, Swagger.
Endpoints: Four (saveFullName, saveEmail, savePhone, savePassword).
Functionality: This application handles the saving and updating of user information, including full name, email, phone number, and password. It uses sessions to track user data during the update process, ensuring data integrity and security throughout the multi-step registration process.
