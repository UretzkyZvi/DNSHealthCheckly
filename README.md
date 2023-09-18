
# DNS HealthCheckly - Interview Challenge

## Introduction

DNS HealthCheckly is a proof-of-concept application designed to address the challenge set by Checkly for DNS health monitoring. The application provides metrics and validations that are essential for assessing the health of a DNS query. This README serves as a guide on how to set up and run the application, as well as an explanation of the design and implementation decisions taken.

## Table of Contents

1. [The Problem](#the-problem)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
3. [Architecture & Decisions](#architecture--decisions)
   - [DNS Checking Mechanism](#dns-checking-mechanism)
   - [Design & Trade-offs](#design--trade-offs)
4. [Design & Implementation](#design--implementation)
   - [Region-Specific Testing](#region-specific-testing)
   - [Failure Scenarios](#failure-scenarios)
   - [Thresholds and Checks](#thresholds-and-checks)
5. [Usage](#usage)
6. [Testing](#testing)

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
## Architecture & Decisions

### DNS Checking Mechanism
The core of this solution is the DNSOperator class, which is responsible for querying DNS servers. It uses the **dns-packet** library for encoding and decoding DNS packets, enabling us to customize queries according to region-specific needs.

### Design & Trade-offs
The application is split into a backend and a frontend to decouple data processing from the user interface. While this adds some complexity, it allows for greater flexibility and scalability.

One significant trade-off was the decision to use pre-configured DNS servers for our checks instead of dynamically selecting the closest DNS server based on geo IP location. This choice was made for simplicity and to avoid the added latency and complexity of determining the closest server dynamically. 
While it may not represent the most accurate real-world conditions, it provides a more straightforward and reliable setup for this proof-of-concept application.

## Design & Implementation

### Core Components

1. **DNSHealthChecker**:  
   The orchestrator of the application. It initializes and manages the DNSOperator, ThresholdValidator, and MetricsStorage. It also schedules periodic DNS checks based on user settings.

2. **DNSOperator**:  
   Responsible for making DNS queries to predefined DNS servers, allowing for region-specific DNS testing.

3. **ThresholdValidator**:  
   Evaluate the returned DNS query metrics against predefined or user-specified thresholds to determine DNS health.

4. **MetricsStorage**:  
   Stores the DNS query metrics and the calculated health status for historical analysis.

5. **Server**:  
   The Express server exposes the REST API for interacting with the system.

### Trade-offs and Decisions

1. **Pre-configured DNS Servers**:  
   The application uses pre-configured DNS servers for region-specific testing instead of using a Geo IP location service. This decision was made to avoid external dependencies and to ensure consistent testing environments.

2. **Threshold Customization**:  
   We allow users to customize thresholds. This feature enhances user experience but also introduces complexity regarding validation and consistency.

3. **Error Handling**:  
   The application is designed to provide meaningful error messages, optimizing for unhappy paths.

4. **Metrics Focus**:  
   The system focuses on three primary metrics: response time, status code, and Time to Live (TTL). This focus simplifies the system while still providing comprehensive DNS health insights.

### Region-Specific Testing

DNS is a distributed system, meaning that a DNS query's health can vary based on geographical location. Our application uses regional DNS servers to perform the DNS queries, allowing users to understand DNS health from various vantage points worldwide.

### Failure Scenarios

Monitoring is not just about tracking when everything is running smoothly; knowing when things go awry is equally important. Our application is designed to provide actionable and meaningful error messages for different failure scenarios. This way, users can quickly understand and act upon any issues.

### Thresholds and Checks

The application uses the following metrics and thresholds to assess DNS health:

- **Response Time**: The default threshold is set to 200ms. This is based on industry standards that suggest that a DNS query should ideally be resolved within 200ms for a responsive user experience.

- **Status Code**: The default expected status code is "NOERROR", indicating a successful DNS query per DNS protocol specifications.

- **Time to Live (TTL)**: The default threshold is 300 seconds. Short TTL values can indicate instability, whereas excessively long TTL values can lead to outdated caching.

#### Health Calculation

DNS health is determined by comparing each metric against its respective threshold:

1. If the response time is less than or equal to 200ms, it's considered healthy.
2. If the DNS query returns a status code of "NOERROR," it's considered healthy.
3. If the TTL is less than or equal to 300 seconds, it's considered healthy (Optional, default not counted in the healthy calculation).

A DNS query is considered healthy only if it passes all the above checks.

These default values and rules are based on industry standards and can be customized per user requirements.


## Usage

Refer to the individual README files in the `backend` and `frontend` directories for usage instructions.

## Testing

Run the following command to execute the acceptance tests:

```
npm test
```

