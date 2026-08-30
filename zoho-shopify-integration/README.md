# Zoho CRM & Shopify Integration

A FastAPI-based backend application that integrates with **Zoho CRM** and **Shopify Admin API**.

The project demonstrates OAuth authentication, token management, CRUD operations for Zoho CRM contacts and leads, and customer/order operations through Shopify.

---

## Features

### Zoho CRM

#### Authentication
- Zoho OAuth 2.0 authentication
- Authorization code exchange
- Offline access with refresh token
- Access token persistence
- Automatic access token refresh before expiration

#### Contacts
- Create Contact
- Get Contact
- List Contacts
- Update Contact
- Delete Contact

#### Leads
- Create Lead
- Get Lead
- List Leads

### Shopify

#### Authentication
- Shopify app authentication
- Client credentials authentication
- Access token caching
- Automatic token renewal when required

#### Customers
- Create Customer
- Get Customer
- List Customers
- Update Customer

#### Orders
- List Orders
- Get Order

---

## Technology Stack

- Python
- FastAPI
- Pydantic
- Pydantic Settings
- SQLAlchemy
- SQLite
- HTTPX
- Uvicorn
- Zoho CRM API
- Shopify Admin API

---

## Project Structure

```text
zoho-shopify-integration/
│
├── app/
│   ├── api/
│   │   ├── zoho_routes.py
│   │   ├── zoho_contact_routes.py
│   │   ├── zoho_lead_routes.py
│   │   ├── shopify_auth_routes.py
│   │   ├── shopify_customer_routes.py
│   │   └── shopify_order_routes.py
│   │
│   ├── core/
│   │   └── config.py
│   │
│   ├── database/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── token_repository.py
│   │
│   ├── schemas/
│   │   ├── zoho.py
│   │   ├── lead.py
│   │   └── shopify.py
│   │
│   ├── zoho/
│   │   ├── auth.py
│   │   ├── client.py
│   │   ├── contact_service.py
│   │   ├── lead_service.py
│   │   ├── token_service.py
│   │   └── dependencies.py
│   │
│   ├── shopify/
│   │   ├── auth.py
│   │   ├── client.py
│   │   ├── customer_service.py
│   │   └── order_service.py
│   │
│   └── main.py
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md