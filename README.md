# Design and Implementation of Attendance System with Multi Factor Authentication

This repository contains the codebase for the Final Year Project: **Design and Implementation of Attendance System with Multi Factor Authentication**.

## Project Architecture

The system is structured as a monorepo containing three main components:

- **[`server/`](file:///Users/sonkey/Desktop/project/server)** (or `api`): The backend server housing the application logic, database integrations, authentication services (MFA, TOTP, Biometrics, etc.), and API endpoints.
- **[`mobile/`](file:///Users/sonkey/Desktop/project/mobile)**: The mobile application interface used by students/employees for clocking in/out, managing MFA devices, and viewing attendance logs.
- **[`web/`](file:///Users/sonkey/Desktop/project/web)** (or `admin`): The web portal for administrators and instructors/managers to track attendance records, manage users, set up geofencing/MFA rules, and generate reports.

## Features

- **Multi-Factor Authentication (MFA)**: Enhancing attendance logging security using verification methods such as:
  - Password/PIN credential check
  - Time-based One-Time Password (TOTP) / Authenticator app support
  - Biometrics (Face/Fingerprint recognition where applicable)
  - Location/Geofencing validation
- **Real-time Attendance Tracking**: Accurate timestamps for entry and exit.
- **Reporting & Analytics**: Comprehensive dashboards for viewing and exporting attendance records.

## Setup Instructions

*(To be updated as development begins)*

### Prerequisites
- Node.js / Python / Go (depending on backend choice)
- Mobile framework SDK (Flutter / React Native / Native)
- Database setup (SQL/NoSQL)
