Tagada: Loan Management App
Tagada is a web application designed to streamline loan management for moneylenders and borrowers. Built with the MERN stack (adjusted for SQL), Tailwind CSS, Redux, and Redis, it provides real-time tracking, automated record-keeping, and payment management with a responsive, user-friendly interface.



Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [How to Get Started](#how-to-get-started)
Features
Log and manage daily loan entries with customer details (e.g., ID, name, area) and payment status.
Track loan history, payment trends, and active loans through a comprehensive dashboard.
Offer role-based access: moneylenders for real-time tracking and borrowers for transparent terms.
Enable quick transactions with a Scan & Pay feature using QR codes.
Visualize payment trends with interactive charts and allow report downloads.
Provide detailed loan information and payment schedules via a calendar interface.
Tech Stack
Frontend: React, Redux, Tailwind CSS
Backend: Node.js, Express.js
Database: SQL (e.g., MySQL or PostgreSQL)
Caching: Redis
Tools: npm, nodemon, Git
Installation
Prerequisites
Node.js (v16 or higher)
SQL database (e.g., MySQL or PostgreSQL) with a running server
Redis (local or cloud instance)
npm (v8 or higher)
Steps
Clone the repository:
bash

Collapse

Wrap

Copy
git clone https://github.com/your-username/tagada-loan-app.git
cd tagada-loan-app
Install dependencies:
Backend: cd backend && npm install
Frontend: cd ../frontend && npm install
Set up the SQL database:
Create a database (e.g., tagada_db) and run any provided schema SQL file to set up tables.
Set up Redis:
Start Redis locally (redis-server) or connect to a cloud instance.
Test the connection: redis-cli ping (should return PONG).
Usage
Start the Application:
Navigate to the backend directory and start the server:
bash

Collapse

Wrap

Copy
cd backend
nodemon
(The API will be available at http://localhost:5000.)
Navigate to the frontend directory and start the development server:
bash

Collapse

Wrap

Copy
cd ../frontend
npm run dev
Open your browser and go to http://localhost:3000.
Sign Up and Log In:
On the landing page, click "Moneylender Sign Up" or "Borrower Sign Up" to begin registration.
On the signup form, select your role, then enter your username, email address, phone number, 12-digit Aadhaar number, and full name. Submit the form to create your account.
Return to the landing page, click "Login", and use your credentials to access the dashboard.
Explore the Dashboard:
After logging in, the dashboarddisplays key metrics: total loans (11), total amount (₹44,505), last payment (₹1,376), and due amount (₹42,033).
Use the "Quick Actions" section for options like "New Loan", "Overview", "Download", or "Graph".
View Active Loans:
From the dashboard, check the active loans table, which lists UID, name, loan amount, due amount, status, and an action column.
Click "View Details" on any row to see more information about a specific loan.
Add a New Loan:
From the dashboard, select "New Loan" to open the loan entry form.
Enter the Customer ID, select an Area from the dropdown, and input the Loan Amount, Paid Amount, Unpaid Amount, and Installment (PPD). Click submit to save the loan.
Manage Areas:
Navigate to the menu and select "Areas" to access the manage areas page.
Search for existing areas, check boxes to select areas (e.g., "viga", "area 1"), and use the red trash icons to delete. Click "+" to add more areas or "Add New Area" to save.
View Payment Trends:
From the menu, select "Payment Trend" to see the chart.
The chart displays expected vs. received amounts (e.g., ₹1 vs. ₹0.8) and area-wise distribution (e.g., area 1, viga, area).
Check Payment Calendar:
From the menu, select "Overview" or a calendar option to view the calendar.
The calendar highlights payment dates (e.g., April 12 in blue). Click a date to view payment details for that day.
View Loan Details:
Click "View Details" on an active loan row to open the loan details popup.
View Loan ID, Customer UID, borrower name, area, paid (₹1361) and due (₹8639) amounts, installment (PPD 100), start date (9/3/2025), end date (9/4/2025), status (Active), and payment schedule.
Use Scan & Pay:
From the menu, select "Scan and Pay" to access the scan page.
Click "Scan QR Code" to scan a customer’s QR code, then view the scanned Customer ID and recent transactions (e.g., received payment +$245.00, service fee -$4.50).
Configuration
Backend: Create backend/.env with:
env

Collapse

Wrap

Copy
PORT=5000
SQL_URI=your-sql-connection-string (e.g., mysql://user:password@localhost:3306/tagada_db)
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
Frontend: Create frontend/.env with:
env

Collapse

Wrap

Copy
VITE_API_URL=http://localhost:5000/api
Tailwind CSS: Customize styles in frontend/tailwind.config.js if needed.
Contributing
Fork the repository.
Create a feature branch: git checkout -b feature/your-feature-name.
Commit changes: git commit -m "Add your feature".
Push to the branch: git push origin feature/your-feature-name.
Open a Pull Request.
See  for guidelines.

License
MIT License. See  for details.

Contact
Email: your-email@example.com
GitHub Issues: Open an Issue
Twitter/X: @your-username
How to Get Started
After setup at http://localhost:3000:

Sign up using the landing pageand form.
Log in to access the dashboard.
Manage loans by adding new ones, viewing active loans, and checking details.
Track payments with the calendaror trends.
Use Scan & Pay for transactions.
