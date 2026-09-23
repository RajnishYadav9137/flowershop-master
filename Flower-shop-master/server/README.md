# Flower-shop Backend

This is a minimal Node + Express backend for the Flower-shop project.

Requirements
- Node.js (14+ recommended)

Optional: MongoDB
------------------
This project can use MongoDB for persistence. By default the server will try to connect to the URI defined in the `MONGODB_URI` environment variable. If not set it will try `mongodb://localhost:27017/flowershop`.

To use MongoDB locally:

1. Install and start MongoDB (for example via Docker):

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:6
```

2. Start the server with the environment variable (PowerShell):

```powershell
cd server
$env:MONGODB_URI = 'mongodb://localhost:27017/flowershop'
npm start
```

3. (Optional) Migrate existing JSON data into MongoDB:

```powershell
cd server
node migrate_to_mongo.js
```

Install & run (PowerShell):

```powershell
cd server
npm install
npm start
```

The server serves the frontend (project root) and exposes these endpoints:
- POST /api/register  -> body: { name, email, password }
- POST /api/contact   -> body: { name, email, message }
- POST /api/checkout  -> body: { items: [...], total, customer }

Saved data is stored in `server/data/*.json`.
