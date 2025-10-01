# Company Registration App

This is a full-stack application for company registration, built with a React frontend and a Node.js backend.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

## Getting Started

Follow these instructions to set up and run the application on your local machine.

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/kumar-siva-sai-G/company-registration-app.git
cd company-registration-app
```

### 2. Set Up the Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create environment files:**
    You need to create two environment files in the `backend` directory: `.env` and `sendgrid.env`.

    **`.env` file:**
    ```
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    FIREBASE_SERVICE_ACCOUNT=<your_firebase_service_account_json>
    TWILIO_ACCOUNT_SID=<your_twilio_account_sid>
    TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
    TWILIO_PHONE_NUMBER=<your_twilio_phone_number>
    ```

    **`sendgrid.env` file:**
    ```
    SENDGRID_API_KEY=<your_sendgrid_api_key>
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend server should now be running on `http://localhost:5000` (or the port you have configured).

### 3. Set Up the Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the `frontend` directory.

    **`.env` file:**
    ```
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application should now be running on `http://localhost:5173` (or the port shown in the terminal).

## Deployment to GitHub

To deploy your code to GitHub, follow these steps:

1.  **Add your changes:**
    ```bash
    git add .
    ```

2.  **Commit your changes:**
    ```bash
    git commit -m "Your commit message"
    ```

3.  **Push to GitHub:**
    ```bash
    git push origin main
    ```
