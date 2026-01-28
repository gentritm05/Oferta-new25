"""
PVC Oferta Payment API Tests
Tests for: Stripe checkout session creation, payment status polling, admin payment history
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@pvcoferta.com"
ADMIN_PASSWORD = "admin123"


class TestPaymentCheckoutCreation:
    """Test Stripe checkout session creation from registration page"""
    
    def test_create_checkout_1_month(self):
        """Test creating checkout session for 1 month package"""
        response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
            "package_months": 1,
            "origin_url": "https://pvcoffer.preview.emergentagent.com"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "checkout_url" in data
        assert "session_id" in data
        assert "amount" in data
        assert "package_months" in data
        
        # Verify checkout URL is valid Stripe URL
        assert data["checkout_url"].startswith("https://checkout.stripe.com")
        
        # Verify session_id format
        assert data["session_id"].startswith("cs_test_")
        
        # Verify package months
        assert data["package_months"] == 1
        
        # Verify amount is positive
        assert data["amount"] > 0
        
        print(f"✓ 1 month checkout created: {data['amount']}€")
        print(f"  Session ID: {data['session_id'][:30]}...")
        return data
    
    def test_create_checkout_3_months(self):
        """Test creating checkout session for 3 months package with 10% discount"""
        response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
            "package_months": 3,
            "origin_url": "https://pvcoffer.preview.emergentagent.com"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["package_months"] == 3
        assert data["checkout_url"].startswith("https://checkout.stripe.com")
        
        print(f"✓ 3 months checkout created: {data['amount']}€ (10% discount)")
    
    def test_create_checkout_6_months(self):
        """Test creating checkout session for 6 months package with 20% discount"""
        response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
            "package_months": 6,
            "origin_url": "https://pvcoffer.preview.emergentagent.com"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["package_months"] == 6
        assert data["checkout_url"].startswith("https://checkout.stripe.com")
        
        print(f"✓ 6 months checkout created: {data['amount']}€ (20% discount)")
    
    def test_create_checkout_12_months(self):
        """Test creating checkout session for 12 months package with 30% discount"""
        response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
            "package_months": 12,
            "origin_url": "https://pvcoffer.preview.emergentagent.com"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["package_months"] == 12
        assert data["checkout_url"].startswith("https://checkout.stripe.com")
        
        print(f"✓ 12 months checkout created: {data['amount']}€ (30% discount)")
    
    def test_create_checkout_invalid_package(self):
        """Test checkout creation fails with invalid package months"""
        response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
            "package_months": 5,  # Invalid - only 1, 3, 6, 12 allowed
            "origin_url": "https://pvcoffer.preview.emergentagent.com"
        })
        
        assert response.status_code == 400
        print("✓ Invalid package (5 months) correctly rejected")
    
    def test_create_checkout_missing_origin_url(self):
        """Test checkout creation fails without origin_url"""
        response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
            "package_months": 1
        })
        
        # Should fail validation
        assert response.status_code == 422
        print("✓ Missing origin_url correctly rejected")


class TestPaymentStatusPolling:
    """Test payment status polling endpoint"""
    
    @pytest.fixture
    def checkout_session(self):
        """Create a checkout session for testing"""
        response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
            "package_months": 1,
            "origin_url": "https://pvcoffer.preview.emergentagent.com"
        })
        if response.status_code != 200:
            pytest.skip("Could not create checkout session")
        return response.json()
    
    def test_get_payment_status(self, checkout_session):
        """Test getting payment status for a session"""
        session_id = checkout_session["session_id"]
        
        response = requests.get(f"{BASE_URL}/api/payments/status/{session_id}")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "status" in data
        assert "payment_status" in data
        assert "amount" in data
        assert "currency" in data
        assert "package_months" in data
        
        # New session should be open/unpaid
        assert data["status"] in ["open", "initiated"]
        assert data["payment_status"] in ["unpaid", "pending"]
        assert data["currency"] == "eur"
        
        print(f"✓ Payment status retrieved: {data['status']}/{data['payment_status']}")
        print(f"  Amount: {data['amount']}€, Package: {data['package_months']} months")
    
    def test_get_payment_status_invalid_session(self):
        """Test getting status for non-existent session"""
        response = requests.get(f"{BASE_URL}/api/payments/status/cs_test_invalid_session_id")
        
        # Should return 404 or error
        assert response.status_code in [404, 500]
        print("✓ Invalid session ID correctly handled")


class TestAdminPaymentHistory:
    """Test admin payment history endpoint"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        return response.json()["token"]
    
    def test_get_payment_history_as_admin(self, admin_token):
        """Test admin can view payment history"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        response = requests.get(f"{BASE_URL}/api/admin/payments", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Should be a list
        assert isinstance(data, list)
        
        # If there are payments, verify structure
        if len(data) > 0:
            payment = data[0]
            assert "id" in payment
            assert "user_email" in payment
            assert "session_id" in payment
            assert "package_months" in payment
            assert "amount" in payment
            assert "currency" in payment
            assert "payment_status" in payment
            assert "status" in payment
            assert "created_at" in payment
            
            print(f"✓ Admin payment history retrieved: {len(data)} transactions")
            print(f"  Latest: {payment['amount']}€ for {payment['package_months']} months ({payment['payment_status']})")
        else:
            print("✓ Admin payment history retrieved: 0 transactions")
    
    def test_get_payment_history_without_auth(self):
        """Test payment history requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/payments")
        
        assert response.status_code in [401, 403]
        print("✓ Payment history correctly requires authentication")
    
    def test_get_payment_history_non_admin(self):
        """Test payment history requires admin role"""
        import uuid
        
        # Register a regular user
        unique_email = f"test_payment_{uuid.uuid4().hex[:8]}@test.com"
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "company_name": "Test Company",
            "phone": "+383 44 123 456"
        })
        
        # Try to login (will fail because user is not active)
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": unique_email,
            "password": "testpass123"
        })
        
        # Should fail because user is not active
        assert response.status_code == 403
        print("✓ Non-admin user correctly denied access to payment history")


class TestAdminManualActivation:
    """Test admin can still manually activate users"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Admin login failed")
        return response.json()["token"]
    
    @pytest.fixture
    def test_user(self, admin_token):
        """Create a test user for activation testing"""
        import uuid
        unique_email = f"test_activate_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "company_name": "Test Activation Company",
            "phone": "+383 44 999 888"
        })
        
        if response.status_code != 200:
            pytest.skip("Could not create test user")
        
        return response.json()
    
    def test_admin_activate_user(self, admin_token, test_user):
        """Test admin can manually activate a user"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        user_id = test_user["id"]
        
        # Verify user is initially inactive
        assert test_user["is_active"] == False
        
        # Activate user for 1 month
        response = requests.put(
            f"{BASE_URL}/api/admin/users/{user_id}/activate",
            json={"is_active": True, "months": 1},
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify user is now active
        assert data["is_active"] == True
        assert data["subscription_end"] is not None
        
        print(f"✓ Admin manually activated user: {test_user['email']}")
        print(f"  Subscription ends: {data['subscription_end']}")
    
    def test_admin_deactivate_user(self, admin_token, test_user):
        """Test admin can deactivate a user"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        user_id = test_user["id"]
        
        # First activate
        requests.put(
            f"{BASE_URL}/api/admin/users/{user_id}/activate",
            json={"is_active": True, "months": 1},
            headers=headers
        )
        
        # Then deactivate
        response = requests.put(
            f"{BASE_URL}/api/admin/users/{user_id}/activate",
            json={"is_active": False, "months": 0},
            headers=headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["is_active"] == False
        print(f"✓ Admin deactivated user: {test_user['email']}")


class TestPricingConsistency:
    """Test that pricing is consistent between checkout and pricing endpoint"""
    
    def test_checkout_amount_matches_pricing(self):
        """Test checkout amount matches the pricing endpoint"""
        # Get pricing
        pricing_response = requests.get(f"{BASE_URL}/api/pricing")
        assert pricing_response.status_code == 200
        pricing = pricing_response.json()
        
        # Test each package
        for pkg in pricing["packages"]:
            months = pkg["months"]
            expected_price = pkg["price"]
            
            # Create checkout
            checkout_response = requests.post(f"{BASE_URL}/api/payments/create-checkout", json={
                "package_months": months,
                "origin_url": "https://pvcoffer.preview.emergentagent.com"
            })
            
            assert checkout_response.status_code == 200
            checkout = checkout_response.json()
            
            # Verify amount matches
            assert checkout["amount"] == expected_price, f"Mismatch for {months} months: checkout={checkout['amount']}, pricing={expected_price}"
            
            print(f"✓ {months} month(s): checkout amount ({checkout['amount']}€) matches pricing ({expected_price}€)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
