# Backend Service for DNSHealthCheckly
This is the backend service for DNSHealthCheckly. It provides the necessary APIs to interact with the frontend and other services.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Available Endpoints](#available-endpoints)
- [Running Tests](#running-tests)
 

## Technologies Used

- Node.js
- Express.js
- Jest for testing
- PostgreSQL 

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**

    ```bash
    git clone https://github.com/UretzkyZvi/DNSHealthCheckly.git
    ```

2. **Navigate to the backend directory**

    ```bash
    cd DNSHealthCheckly/backend
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Start the server**

    ```bash
    npm start
    ```

The service should be up and running at `http://localhost:8081`.

## API Endpoints

### Get Current Configuration
- **Endpoint**: `/config`
- **Method**: GET
- **Response**: Returns the current DNS check settings.
  
### Update Configuration
- **Endpoint**: `/config`
- **Method**: POST
- **Request Body**: JSON object containing new configuration settings.
- **Response**: Confirmation message.

### Get DNS Metrics
- **Endpoint**: `/metrics`
- **Method**: GET
- **Query Parameters**: 
  - `startTime`: Start time for the data fetch (optional).
  - `endTime`: End time for the data fetch (optional).
  - `nameServer`: Specific name server to fetch metrics for (optional).
- **Response**: DNS metrics data.

### Get Server Health
- **Endpoint**: `/server-health`
- **Method**: GET
- **Query Parameters**: 
  - `startTime`: Start time for the data fetch (optional).
  - `endTime`: End time for the data fetch (optional).
  - `serverName`: Specific server name to fetch health data for (optional).
- **Response**: Server health data.

## Running Tests

1. **Navigate to the backend directory**

    ```bash
    cd DNSHealthCheckly/backend
    ```

2. **Run the tests**

    ```bash
    npm test
    ```

This will execute all the test cases using Jest.

 
