
# DNS HealthCheckly - Interview Challenge

## Introduction

DNS HealthCheckly is a proof-of-concept application designed to address the challenge set by Checkly for DNS health monitoring. The application provides metrics and validations that are essential for assessing the health of a DNS query. This README serves as a guide on how to set up and run the application, as well as an explanation of the design and implementation decisions taken.

## Table of Contents

1. [The Problem](#the-problem)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
3. [Design & Implementation](#design--implementation)
   - [Region-Specific Testing](#region-specific-testing)
   - [Failure Scenarios](#failure-scenarios)
   - [Thresholds and Checks](#thresholds-and-checks)
4. [Usage](#usage)
5. [Testing](#testing)

## The Problem

The primary challenge is to create a JavaScript function that returns essential metrics to validate the health of a DNS query. These metrics are then compared against predefined thresholds to determine whether the DNS query is healthy. 

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- Docker (optional)

### Installation

# Clone the repository
```
git clone https://github.com/UretzkyZvi/DNSHealthCheckly.git
```

# Navigate to the project folder
```
cd DNSHealthCheckly
```

# Install dependencies for backend
```
cd backend && npm install
```
# Install dependencies for frontend
```
cd ../frontend && npm install
```

Or use Docker:

```
docker-compose up --build
```

## Design & Implementation

### Region-Specific Testing

DNS is a distributed system, and therefore it's crucial to perform checks that are region-specific. We address this by using regional DNS servers to perform the DNS queries.

### Failure Scenarios

Monitoring is primarily about unhappy paths. The application is designed to provide meaningful error messages that users can act upon. 

### Thresholds and Checks

The application uses the following metrics and thresholds for DNS health checks:

- **Response Time**: Must be below 200ms
- **Status Code**: Must return "NOERROR"
  
These thresholds are set based on industry standards and personal experience.

## Usage

Refer to the individual README files in the `backend` and `frontend` directories for usage instructions.

## Testing

Run the following command to execute the acceptance tests:

```
npm test
```

