# Brightloop Subscription Management System – Backend API
> **Odoo X Make-A-Ton Virtual Hackathon Project**  
> *FastAPI Microservice & Odoo XML-RPC Integration Layer*

---

## 📌 Architecture Overview

The backend service is engineered using **FastAPI** (Python 3.12) to serve as a high-throughput, asynchronous API bridge for the Brightloop Subscription Management platform. It supports:
- Full RESTful API endpoints for all 11 frontend modules (`/api/v1/*`).
- **Odoo ERP XML-RPC Client:** Syncing contacts (`res.partner`), catalog items (`product.template`), orders (`sale.order`), and accounting ledger moves (`account.move`).
- **Recurring Billing Engine:** Normalized MRR calculations, cycle cadence determination, and automated invoice triggers.
- Interactive OpenAPI / Swagger UI at `/api/v1/docs`.

---

## 🚀 Setup & Execution

### Local Python Environment
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the API development server
uvicorn app.main:app --reload --port 8000
```

The interactive API documentation is accessible at:
- **Swagger UI:** `http://localhost:8000/api/v1/docs`
- **ReDoc:** `http://localhost:8000/api/v1/redoc`
- **Health Check:** `http://localhost:8000/health`

---

## 🐳 Docker Execution

```bash
docker build -t brightloop-backend .
docker run -p 8000:8000 --env ODOO_URL=http://host.docker.internal:8069 brightloop-backend
```
