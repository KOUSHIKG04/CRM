# CRM Application

A comprehensive Customer Relationship Management (CRM) application with role-based access control, lead management, and call tracking capabilities.

## Features

- **User Authentication & Authorization**

  - Secure JWT-based authentication
  - Role-based access control (Admin & Telecaller)
  - User registration and login
  - Protected routes

- **Lead Management**

  - Create, read, update, and delete leads
  - Assign leads to telecallers
  - Track lead status and call responses
  - Detailed lead information (name, email, phone, address)

- **Call Tracking**

  - Record call attempts and outcomes
  - Multiple call response types:
    - Discussed
    - Callback
    - Interested
    - Busy
    - Ringing No Response (RNR)
    - Switched Off
  - Automatic timestamp tracking
  - Call history per lead

- **Dashboard & Analytics**

  - Real-time statistics
    - Total telecallers
    - Total leads
    - Connected calls
  - Call trends visualization (7-day chart)
  - Detailed call records table
  - Color-coded status indicators

- **User Management**
  - Admin can view all leads and telecallers
  - Telecallers can manage their assigned leads
  - Profile management
  - Role-based permissions

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for input validation

### Frontend

- React
- Material-UI
- React Router
- Chart.js for analytics
- Axios for API calls
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd crm-application
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm
JWT_SECRET=your_jwt_secret
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Leads

- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `PATCH /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
- `PATCH /api/leads/:id/status` - Update lead status

### Dashboard

- `GET /api/users/dashboard/stats` - Get dashboard statistics
- `GET /api/leads/connected` - Get connected calls

## User Roles

### Admin

- View all leads and telecallers
- Create and manage leads
- View dashboard statistics
- Manage user accounts
- Delete leads

### Telecaller

- View assigned leads
- Update lead status and call responses
- View personal dashboard
- Update profile information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
