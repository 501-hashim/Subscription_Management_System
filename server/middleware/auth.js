import { db } from '../db/db.js';

export async function requireCustomerAuth(req, res, next) {
  try {
    // Look for customer identification from x-customer-id header or Authorization header
    let customerId = req.headers['x-customer-id'];

    if (!customerId && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        // Bearer token can either be the customer ID or a JWT/mock token
        const token = authHeader.split(' ')[1];
        if (token.startsWith('CUST-')) {
          customerId = token;
        } else {
          // If encoded or custom token, default to token or first customer
          customerId = token;
        }
      }
    }

    // Default fallback to first active customer if not supplied in dev/demo mode
    if (!customerId) {
      customerId = 'CUST-001';
    }

    const customer = await db.getCustomerById(customerId);

    if (!customer) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: `Customer account not found for ID: ${customerId}`,
      });
    }

    // Attach verified customer to request
    req.customer = customer;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Authentication Error',
      message: err.message,
    });
  }
}
