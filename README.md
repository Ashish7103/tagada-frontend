# Tagada: Loan Management App

**Tagada** is a web application that simplifies loan management for moneylenders and borrowers. Developed using the MERN stack, Tailwind CSS, Redux, and Redis, it provides real-time loan tracking, automated record-keeping, and efficient payment management. With its responsive, intuitive interface, Tagada eliminates the need for time-consuming manual daily payment entries.

![Tagada Landing Page](docs/screenshots/landing-page.png)

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [How to Get Started](#how-to-get-started)

## Features
- Log and manage daily loan entries with customer details and payment status.
- Track loan history, payment trends, and active loans via an intuitive dashboard.
- Role-based access for moneylenders (real-time tracking) and borrowers (transparent terms).
- Scan & Pay feature for quick maintain payment record using QR codes.
- Visualize payment trends with charts and download reports.
- View loan details and payment schedules with a calendar interface.

## Tech Stack
- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MYSQL
- **Caching**: Redis
- **Tools**: npm, nodemon, Git

## Installation
npm install

Set up Tagada locally with the following steps:

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Redis (local or cloud instance)
- npm (v8 or higher)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Ashish7103/tagada-frontend.git
   cd frontend
   npm install
   npm run dev
## User Manual
Creating an Account {#creating-an-account}
Access the App:
Open your browser and navigate to http://localhost:3000 (or the deployed URL if provided).
You will see the landing page.
Sign Up:
Click "Moneylender Sign Up" or "Borrower Sign Up" (for loan takers).
Fill out the signup formwith the following details:
Name: Your full name.
Email Address: A valid email.
User ID: A unique identifier you choose.
Aadhaar Number: Your 12-digit Aadhaar number.
Mobile Number: Your active phone number.
Select your role (Moneylender or Loan Taker) and submit the form.
Unique UID Generation:
Upon successful submission, Tagada will generate a unique 6-digit UID for your account (e.g., 123456). This UID will be displayed on your dashboard and used for loan transactions.
Log In:
Return to the landing page, click "Login", and enter your User ID and a password (set during signup or provided) to access your account.
For Moneylenders {#for-moneylenders}
If you are a moneylender, follow these steps to manage loans effectively:

Set Up Loan Areas:
From the menu, select "Areas" to open the manage areas page.
Add all areas where you distribute loans (e.g., "viga", "area 1"):
Search for existing areas or check boxes to select them.
Click "+" to add new areas and "Add New Area" to save.
This step is required before issuing loans to organize your loan distribution.
Create a Loan:
Navigate to the dashboardand click "New Loan".
Open the loan entry form.
Fill in the details:
UID: Enter the 6-digit UID of the loan taker (they must be a registered user).
Area: Select an area from the dropdown (added in the previous step).
Loan Amount: Enter the total amount, including the principal + interest rate.
Paid Amount: Enter any amount already paid (initially 0).
Unpaid Amount: Calculated as Loan Amount - Paid Amount.
Installment (PPD): Set the per-day payment amount.
Submit the form to create the loan.
View Loan Dashboard:
After creating a loan, you’ll be redirected to the loan dashboard.
Check all active loans, including UID, name, loan amount, due amount, status, and "View Details" options.
For Loan Takers {#for-loan-takers}
If you are a loan taker, your experience focuses on tracking and managing your loan:

Access Your Dashboard:
Log in with your 6-digit UID and password.
View your dashboardto see your loan status (e.g., required amount, paid amount).
Check Loan Details:
Click "View Details" on the active loans tableto see specifics.
Review paid (e.g., ₹1361), due (e.g., ₹8639) amounts, installment (e.g., PPD 100), and payment schedule.
Track Payments:
Use the calendarto see due dates (e.g., April 12) and click to view details.
Check payment trendsfor expected vs. received amounts.
Managing Loans {#managing-loans}
For Moneylenders:
Monitor all loans on the dashboard.
Update loan statuses or details by clicking "View Details"and editing if supported.
For Loan Takers:
Ensure timely payments based on the schedule in.
Contact your moneylender for adjustments if needed.
Collecting Payments {#collecting-payments}
Daily Collection:
As a moneylender, meet the loan taker to collect the daily installment.
Ask the loan taker to provide their QR code (generated via the app).
Scan and Record Payment:
From the menu, select "Scan and Pay".
Click "Scan QR Code" to scan the loan taker’s QR code.
Enter the amount collected and submit the record.
The payment will be updated in the tabular formand reflected in the calendar viewon the dashboard.
Verify:
Check the dashboard to ensure the paid amount is updated (e.g., last payment ₹1,376 increases with new collections).
Troubleshooting {#troubleshooting}
Login Issues: Ensure your User ID and password are correct. Reset via the "Login" page if needed.
QR Scan Failure: Verify the QR code is generated by Tagada and not damaged. Retry or request a new code.
Loan Not Showing: Confirm the loan taker’s UID is valid and they are a registered user.
Contact Support if issues persist (see below).
Contact Support {#contact-support}
Email: freesprre7103Ashu@gmail.com
GitHub Issues: Open an Issue
Twitter/X: @Ashish7103
