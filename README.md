# API Documentation

## Description
This API provides functionality for managing ticket reservation

### Notes
- Based on the requirements I made the API multiuser based on roles making it so that the admin has access to all of the endpoints and the user can only POST to `/api/reservations`
- There's a swagger file with examples
- To run 1) change .env.sample for .env 2) go to terminal and type `npm run server` 

### Login and login credentials

The API has the following routes:

- `POST /api/login`: User login route. Public of course
The credentials are the following:
```JSON
  email: 'jane@example.com',
  password: 'password123',
  role: 'admin'
```
  and the normal user is 
```JSON
  email: 'john@example.com',
  password: 'password123',
  role: 'user'
```
To check the
- `POST /api/reservations`: Create a new reservation.
- `GET /api/shows`: Get shows with optional filtering options.
- `GET /api/shows/:showId/performances/:performanceId/seats`: Get seats for a specific show performance.



## Models

### Performance
- `show`: Refers to the associated show.
- `date`: Date of the performance.
- `availableSeats`: Array of available seats for the performance. Each seat object contains a reference to the seat and a boolean flag indicating if it's reserved.

### Reservation
- `performance`: Refers to the performance for which the reservation is made.
- `dni`: Customer's identification number.
- `name`: Customer's name.
- `seats`: Array of seats reserved, including the section, row, number, and price.

### Show
- `name`: Name of the show.
- `venue`: Refers to the associated venue.
- `performances`: Array of performance references for the show.

### User
- `name`: User's name.
- `email`: User's email (unique).
- `password`: User's password.
- `role`: User's role (admin or user, default is user).
- `createdAt`: Date of user creation.

### Venue
- `name`: Venue name.
- `location`: Venue location.
- `capacity`: Venue capacity.
- `sections`: Array of venue sections, each containing a name and an array of seats.
