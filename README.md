# CRM

A comprehensive Customer Relationship Management (CRM) application with role-based access control, lead management, and call tracking capabilities.

## Features

### User Authentication & Authorization

- Secure JWT-based authentication
- Role-based access control (Admin & Telecaller)
- User registration and login
- Protected routes
- Profile management

### Lead Management

- Create, read, update, and delete leads
- Assign leads to telecallers
- Track lead status and call responses
- Detailed lead information (name, email, phone, address)
- Lead history tracking

### Call Tracking System

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
- Next call scheduling

### Dashboard & Analytics

- Real-time statistics:
  - Total telecallers
  - Total leads
  - Connected calls
  - Conversion rates
- Call trends visualization (7-day chart)
- Detailed call records table
- Color-coded status indicators
- Performance metrics

### User Management

- Admin can view all leads and telecallers
- Telecallers can manage their assigned leads
- Profile management
- Role-based permissions
- User activity tracking

## System Architecture & Workflow

```mermaid
flowchart TD
    subgraph "Frontend"
        FE_R("React Frontend"):::frontend
        FE_Pages("Pages: Dashboard, Login, Register, TelecallerPage"):::frontend
        FE_UI("UI Components: Navbar, Logo, etc."):::frontend
        FE_UI2("UI Library"):::frontend
        FE_Context("Auth Context Provider"):::frontend
        FE_Services("API Services (Axios)"):::frontend
    end

    subgraph "Backend"
        BE_Express("Express API Server"):::backend
        BE_Routes("API Routes: Auth, Leads, Users"):::backend
        BE_Controllers("Controllers: Auth, Leads, User"):::backend
        BE_Middleware("JWT Auth Middleware"):::backend
        BE_Models("Models: Lead & User"):::backend
    end

    DB("MongoDB Database"):::database

    %% Frontend internal flow
    FE_R --> FE_Pages
    FE_R --> FE_UI
    FE_R --> FE_Context
    FE_R --> FE_Services

    %% Frontend to Backend API communication
    FE_Services -->|"HTTP_API_calls_with_JWT"| BE_Express

    %% Backend internal flow
    BE_Express --> BE_Routes
    BE_Routes -->|"calls"| BE_Controllers
    BE_Routes -->|"secured_by"| BE_Middleware
    BE_Controllers -->|"CRUD_ops"| BE_Models

    %% Backend -> Database
    BE_Express -->|"queries"| DB

    %% Click Events for Frontend Components
    click FE_R "https://github.com/koushikg04/crm/tree/main/frontend/src"
    click FE_Pages "https://github.com/koushikg04/crm/tree/main/frontend/src/pages"
    click FE_UI "https://github.com/koushikg04/crm/tree/main/frontend/src/components"
    click FE_UI2 "https://github.com/koushikg04/crm/tree/main/frontend/src/components/ui"
    click FE_Context "https://github.com/koushikg04/crm/blob/main/frontend/src/contexts/AuthContext.jsx"
    click FE_Services "https://github.com/koushikg04/crm/tree/main/frontend/src/services"
    click FE_Services "https://github.com/koushikg04/crm/blob/main/frontend/src/utils/axios.js"

    %% Click Events for Backend Components
    click BE_Express "https://github.com/koushikg04/crm/blob/main/backend/server.js"
    click BE_Routes "https://github.com/koushikg04/crm/tree/main/backend/routes"
    click BE_Controllers "https://github.com/koushikg04/crm/tree/main/backend/controller"
    click BE_Middleware "https://github.com/koushikg04/crm/blob/main/backend/middleware/auth.js"
    click BE_Models "https://github.com/koushikg04/crm/tree/main/backend/models"

    %% Styles
    classDef frontend fill:#AED6F1,stroke:#1B4F72,stroke-width:2px,color:#1B2631;
    classDef backend fill:#FADBD8,stroke:#C0392B,stroke-width:2px,color:#922B21;
    classDef database fill:#ABEBC6,stroke:#27AE60,stroke-width:2px,color:#1E8449;
```

### Key Features of the Architecture

#### Frontend Layer

- **React Frontend**: Core application built with React
- **Pages**: Main application views including Dashboard, Login, Register, and TelecallerPage
- **UI Components**: Reusable components for consistent user interface
- **UI Library**: Comprehensive component library for enhanced design
- **Auth Context**: Global state management for authentication
- **API Services**: Axios-based service layer for backend communication

#### Backend Layer

- **Express Server**: RESTful API server built with Express.js
- **API Routes**: Organized endpoints for Auth, Leads, and Users
- **Controllers**: Business logic implementation
- **JWT Middleware**: Security layer for route protection
- **Models**: Mongoose schemas for data structure

#### Database Layer

- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose ODM**: Object Data Modeling for MongoDB

#### Interactive Features

- All components in the diagram are clickable and link to their respective source code
- Color-coded sections for easy visualization:
  - Frontend (Blue)
  - Backend (Red)
  - Database (Green)

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for input validation
- Mongoose for database operations

### Frontend

- React
- Material-UI
- React Router
- Chart.js for analytics
- Axios for API calls
- Context API for state management
- Vite for build tooling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd insurance-lab
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
MONGODB_URI=mongodb://localhost:27017/insurance-lab
JWT_SECRET=your_jwt_secret
```

5. Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
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
- `GET /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile

### Leads

- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
- `PUT /api/leads/:id/status` - Update lead status
- `PUT /api/leads/:id/call-response` - Update call response

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/leads/connected` - Get connected calls
- `GET /api/dashboard/trends` - Get call trends

## User Roles

### Admin

- View all leads and telecallers
- Create and manage leads
- View dashboard statistics
- Manage user accounts
- Delete leads
- Access all features

### Telecaller

- View assigned leads
- Update lead status and call responses
- View personal dashboard
- Update profile information
- Track call history

## Project Structure

### Backend

```
backend/
├── controller/     # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── server.js       # Main application file
└── .env            # Environment variables
```

### Frontend

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API service functions
│   ├── utils/         # Utility functions
│   ├── assets/        # Static assets
│   └── App.jsx        # Main application component
├── public/            # Public assets
└── vite.config.js     # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

### Backend

- Follow RESTful API design principles
- Implement proper error handling
- Use middleware for common functionality
- Write clean, maintainable code
- Add appropriate comments and documentation

### Frontend

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, maintainable code
- Add appropriate comments and documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
