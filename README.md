# Fast Feet API

This project is a backend system designed to manage deliveries efficiently. It provides a robust API for handling various aspects of the delivery process, including managing couriers, recipients, delivery orders, and delivery problems.

## Features

- **Courier Management:** Add, update, and manage couriers.
- **Recipient Management:** Add, update, and manage recipients.
- **Delivery Order Management:** Create, update, cancel, and track delivery orders.
- **Delivery Problem Management:** Report and manage problems related to deliveries.
- **Authentication:** Secure API with user authentication.
- **Notifications:** Send notifications to couriers and recipients.

## Technologies Used

- **Node.js/Nest:** Runtime environment.
- **PostgreSQL:** Database.
- **Prisma:** ORM.
- **Redis:** Cache.
- **JWT:** Authentication.
- **Nodemailer:** Email sending.
- **Docker:** Containerization.
- **R2 Cloudfare:** File storage.

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- PostgreSQL
- Redis
- R2 Cloudfare
- Docker (optional)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/jeremiassnts/fast-feet-api.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd fast-feet-api
    ```

3.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

4.  Configure environment variables:

    - Create a `.env` file in the root directory.
    - Copy the contents of `.env.example` to `.env`.
    - Update the variables with your database, redis, R2 cloudfare credentials, AWS credentials, and email credentials.

5.  Database setup:

    - Ensure PostgreSQL is running.
    - Run migrations:

      ```bash
      npx prisma generate
      # or
      yarn prisma generate
      ```

      ```bash
      npx prisma migrate dev
      # or
      yarn prisma migrate dev
      ```

6.  Seed the database (optional):
