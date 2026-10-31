import xmlrpc.client
import logging
from typing import Dict, Any, List, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class OdooClient:
    """
    Odoo XML-RPC Integration Client
    Provides seamless bidirectional synchronization with Odoo ERP:
    - res.partner (Customers / Subscribers)
    - product.template (Products & Add-on Services)
    - sale.order (Quotations & Subscription Orders)
    - account.move (Customer Invoices & Billing Records)
    """

    def __init__(self):
        self.url = settings.ODOO_URL
        self.db = settings.ODOO_DB
        self.username = settings.ODOO_USERNAME
        self.password = settings.ODOO_PASSWORD
        self.uid: Optional[int] = None
        self._common = None
        self._models = None

    def connect(self) -> bool:
        """Authenticate with the Odoo XML-RPC service."""
        try:
            self._common = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/common")
            self.uid = self._common.authenticate(self.db, self.username, self.password, {})
            self._models = xmlrpc.client.ServerProxy(f"{self.url}/xmlrpc/2/object")
            logger.info("Successfully connected to Odoo (UID: %s)", self.uid)
            return self.uid is not None
        except Exception as e:
            logger.warning("Could not connect to Odoo instance: %s. Using mock fallback.", str(e))
            return False

    def execute_kw(self, model: str, method: str, args: List[Any], kwargs: Optional[Dict[str, Any]] = None):
        """Execute remote method on Odoo model with fallback handling."""
        if not self.uid and not self.connect():
            logger.info("Simulated Odoo call [%s.%s] executed in mock mode.", model, method)
            return []
        
        kwargs = kwargs or {}
        try:
            return self._models.execute_kw(self.db, self.uid, self.password, model, method, args, kwargs)
        except Exception as e:
            logger.error("Error executing Odoo call [%s.%s]: %s", model, method, str(e))
            return []

    def sync_partner(self, name: str, email: str, is_company: bool = True) -> int:
        """Create or update a customer partner in Odoo."""
        partner_data = {
            'name': name,
            'email': email,
            'is_company': is_company,
            'customer_rank': 1,
        }
        return self.execute_kw('res.partner', 'create', [partner_data])

    def sync_invoice(self, partner_id: int, invoice_lines: List[Dict[str, Any]]) -> int:
        """Create a recurring customer invoice in Odoo Account Move."""
        invoice_vals = {
            'move_type': 'out_invoice',
            'partner_id': partner_id,
            'invoice_line_ids': [
                (0, 0, line) for line in invoice_lines
            ]
        }
        return self.execute_kw('account.move', 'create', [invoice_vals])

odoo_client = OdooClient()
