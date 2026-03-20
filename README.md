# CTSE TicketGo - Frontend

A modern React frontend for the CTSE Event Management System. Built with **Vite**, **React**, and **TypeScript**.

## Architecture Overview

This frontend application communicates with three separate microservices on the backend, which are all routed through a single **AWS Application Load Balancer (ALB)**.

- **Frontend Application** — Interacts with users.
- **ALB (`ticket-go-alb`)** — Acts as a unified API Gateway.
- **Backend Microservices** (Auth, Event, Booking) — Handle core business logic via isolated ECS containers.

## Configure Environment

To run this application locally against the deployed AWS infrastructure, create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://ticket-go-alb-823936217.ap-southeast-1.elb.amazonaws.com/api
```

This single ALB URL correctly routes traffic based on the path (e.g., `/api/auth/*`, `/api/events/*`, `/api/bookings/*`).

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation & Run

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## API Documentation (Swagger UI)

You can explore and test the backend APIs interactively via Swagger UI using the AWS ALB links below:

- **🔐 Auth API:** [`http://ticket-go-alb.elb.amazonaws.com/api/auth/docs`](http://ticket-go-alb-823936217.ap-southeast-1.elb.amazonaws.com/api/auth/docs)
- **📅 Event API:** [`http://ticket-go-alb.elb.amazonaws.com/api/events/docs`](http://ticket-go-alb-823936217.ap-southeast-1.elb.amazonaws.com/api/events/docs)
- **🎫 Booking API:** [`http://ticket-go-alb.elb.amazonaws.com/api/bookings/docs`](http://ticket-go-alb-823936217.ap-southeast-1.elb.amazonaws.com/api/bookings/docs)

 *(Note: Health check endpoints for target groups are located at the `/health` paths on the raw containers and route automatically.)*

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS
- **Routing**: React Router (if applicable)
- **Data Fetching**: Axios / Native Fetch
