# User Module — Sample Requests & Responses

## 1. Create User — `POST /api/users`

### Request
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh.kumar@example.com",
  "phone": "9876543210",
  "password": "Farmer@123",
  "role": "FARMER",
  "location": "Hubballi, Karnataka"
}
```

### Response `201 Created`
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "Ramesh Kumar",
    "email": "ramesh.kumar@example.com",
    "phone": "9876543210",
    "role": "FARMER",
    "location": "Hubballi, Karnataka",
    "createdAt": "2026-08-03T10:15:30"
  },
  "timestamp": "2026-08-03T10:15:30"
}
```

### Duplicate Email — Response `409 Conflict`
```json
{
  "success": false,
  "message": "User already exists with email : 'ramesh.kumar@example.com'",
  "timestamp": "2026-08-03T10:16:02"
}
```

### Validation Failure — Response `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email must be a valid email address",
    "phone": "Phone number must be a valid 10-digit number",
    "password": "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
  },
  "timestamp": "2026-08-03T10:16:45"
}
```

---

## 2. Get All Users — `GET /api/users`

### Response `200 OK`
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Ramesh Kumar",
      "email": "ramesh.kumar@example.com",
      "phone": "9876543210",
      "role": "FARMER",
      "location": "Hubballi, Karnataka",
      "createdAt": "2026-08-03T10:15:30"
    }
  ],
  "timestamp": "2026-08-03T10:20:00"
}
```

---

## 3. Get User By ID — `GET /api/users/1`

### Response `200 OK`
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": 1,
    "name": "Ramesh Kumar",
    "email": "ramesh.kumar@example.com",
    "phone": "9876543210",
    "role": "FARMER",
    "location": "Hubballi, Karnataka",
    "createdAt": "2026-08-03T10:15:30"
  },
  "timestamp": "2026-08-03T10:20:30"
}
```

### Not Found — Response `404 Not Found`
```json
{
  "success": false,
  "message": "User not found with id : '99'",
  "timestamp": "2026-08-03T10:21:00"
}
```

---

## 4. Update User — `PUT /api/users/1`

### Request
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh.kumar@example.com",
  "phone": "9876543210",
  "role": "FARMER",
  "location": "Dharwad, Karnataka"
}
```
> `password` is optional on update — omit it to keep the existing password.

### Response `200 OK`
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "Ramesh Kumar",
    "email": "ramesh.kumar@example.com",
    "phone": "9876543210",
    "role": "FARMER",
    "location": "Dharwad, Karnataka",
    "createdAt": "2026-08-03T10:15:30"
  },
  "timestamp": "2026-08-03T10:25:00"
}
```

---

## 5. Delete User — `DELETE /api/users/1`

### Response `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully",
  "timestamp": "2026-08-03T10:30:00"
}
```
