# Inventory Management System (MERN)

Full-stack IMS boilerplate with:

- Frontend: React + Vite
- Backend: Node.js + Express (MVC)
- Database: MongoDB + Mongoose
- Auth: JWT + role-based (admin, manager, staff)
- Modules: Inventory CRUD, stock transactions, suppliers/customers, dashboard analytics, reports

## Structure

```
IMS/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      server.js
  frontend/
    src/
      components/
      context/
      hooks/
      pages/
      services/
```

## Run

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
