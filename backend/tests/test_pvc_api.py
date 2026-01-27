"""
PVC Oferta API Tests
Tests for: Admin pricing management, Authentication, Offers with multiple items, PDF download
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@pvcoferta.com"
ADMIN_PASSWORD = "admin123"

class TestHealthAndPricing:
    """Test health check and public pricing endpoint"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ API root working: {data['message']}")
    
    def test_get_pricing_public(self):
        """Test public pricing endpoint returns packages"""
        response = requests.get(f"{BASE_URL}/api/pricing")
        assert response.status_code == 200
        data = response.json()
        
        # Verify pricing structure
        assert "monthly_price" in data
        assert "packages" in data
        assert isinstance(data["packages"], list)
        assert len(data["packages"]) == 4  # 1, 3, 6, 12 months
        
        # Verify package structure
        for pkg in data["packages"]:
            assert "months" in pkg
            assert "price" in pkg
            assert "discount" in pkg
        
        # Verify discount percentages
        discounts = {pkg["months"]: pkg["discount"] for pkg in data["packages"]}
        assert discounts[1] == 0
        assert discounts[3] == 10
        assert discounts[6] == 20
        assert discounts[12] == 30
        
        print(f"✓ Pricing endpoint working: {data['monthly_price']}€/month")
        print(f"  Packages: {[(p['months'], p['price']) for p in data['packages']]}")


class TestAdminAuth:
    """Test admin authentication"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "token" in data
        assert "user" in data
        assert data["user"]["is_admin"] == True
        assert data["user"]["email"] == ADMIN_EMAIL
        
        print(f"✓ Admin login successful: {data['user']['email']}")
        return data["token"]
    
    def test_admin_login_invalid_password(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid password correctly rejected")
    
    def test_login_nonexistent_user(self):
        """Test login with non-existent email"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "anypassword"
        })
        assert response.status_code == 401
        print("✓ Non-existent user correctly rejected")


class TestAdminPricingManagement:
    """Test admin pricing management - change monthly price and verify packages update"""
    
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
    
    def test_update_pricing_as_admin(self, admin_token):
        """Test admin can update monthly price and packages recalculate correctly"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Set a new price
        new_price = 75.0
        response = requests.put(
            f"{BASE_URL}/api/admin/pricing",
            json={"monthly_price": new_price},
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response
        assert data["monthly_price"] == new_price
        assert "packages" in data
        
        # Verify package calculations with discounts
        packages = {pkg["months"]: pkg for pkg in data["packages"]}
        
        # 1 month: no discount
        assert packages[1]["price"] == new_price
        assert packages[1]["discount"] == 0
        
        # 3 months: 10% discount
        expected_3m = round(new_price * 3 * 0.9, 2)
        assert packages[3]["price"] == expected_3m
        assert packages[3]["discount"] == 10
        
        # 6 months: 20% discount
        expected_6m = round(new_price * 6 * 0.8, 2)
        assert packages[6]["price"] == expected_6m
        assert packages[6]["discount"] == 20
        
        # 12 months: 30% discount
        expected_12m = round(new_price * 12 * 0.7, 2)
        assert packages[12]["price"] == expected_12m
        assert packages[12]["discount"] == 30
        
        print(f"✓ Admin pricing update successful: {new_price}€/month")
        print(f"  1 month: {packages[1]['price']}€")
        print(f"  3 months: {packages[3]['price']}€ (-10%)")
        print(f"  6 months: {packages[6]['price']}€ (-20%)")
        print(f"  12 months: {packages[12]['price']}€ (-30%)")
    
    def test_update_pricing_without_auth(self):
        """Test pricing update fails without authentication"""
        response = requests.put(
            f"{BASE_URL}/api/admin/pricing",
            json={"monthly_price": 100.0}
        )
        assert response.status_code in [401, 403]
        print("✓ Pricing update correctly requires authentication")
    
    def test_pricing_persists_after_update(self, admin_token):
        """Test that pricing changes persist and are visible publicly"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Set a specific price
        test_price = 60.0
        requests.put(
            f"{BASE_URL}/api/admin/pricing",
            json={"monthly_price": test_price},
            headers=headers
        )
        
        # Verify via public endpoint
        response = requests.get(f"{BASE_URL}/api/pricing")
        assert response.status_code == 200
        data = response.json()
        
        assert data["monthly_price"] == test_price
        print(f"✓ Pricing persists correctly: {test_price}€/month visible publicly")


class TestAdminUserManagement:
    """Test admin user management endpoints"""
    
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
    
    def test_get_admin_stats(self, admin_token):
        """Test admin can get system statistics"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert "total_users" in data
        assert "active_users" in data
        assert "inactive_users" in data
        assert "total_offers" in data
        assert "total_customers" in data
        
        print(f"✓ Admin stats: {data['total_users']} users, {data['active_users']} active")
    
    def test_get_all_users(self, admin_token):
        """Test admin can list all users"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/users", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        print(f"✓ Admin can list users: {len(data)} users found")


class TestUserRegistration:
    """Test user registration flow"""
    
    def test_register_new_user(self):
        """Test new user registration"""
        import uuid
        unique_email = f"test_{uuid.uuid4().hex[:8]}@test.com"
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "company_name": "Test Company",
            "phone": "+383 44 123 456"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == unique_email.lower()
        assert data["company_name"] == "Test Company"
        assert data["is_active"] == False  # New users are inactive
        assert data["is_admin"] == False
        
        print(f"✓ User registration successful: {unique_email}")
        print(f"  User is inactive (awaiting admin activation)")
    
    def test_register_duplicate_email(self):
        """Test registration fails with duplicate email"""
        # First registration
        import uuid
        unique_email = f"dup_{uuid.uuid4().hex[:8]}@test.com"
        
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "company_name": "Test Company",
            "phone": "+383 44 123 456"
        })
        
        # Second registration with same email
        response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "company_name": "Another Company",
            "phone": "+383 44 789 012"
        })
        
        assert response.status_code == 400
        print("✓ Duplicate email correctly rejected")


class TestOffersWithMultipleItems:
    """Test offer creation with multiple products (windows and doors)"""
    
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
    def test_customer(self, admin_token):
        """Create a test customer"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Check if test customer exists
        response = requests.get(f"{BASE_URL}/api/customers", headers=headers)
        if response.status_code == 200:
            customers = response.json()
            for c in customers:
                if c.get("name") == "TEST_MultiItem_Customer":
                    return c
        
        # Create new test customer
        response = requests.post(f"{BASE_URL}/api/customers", json={
            "name": "TEST_MultiItem_Customer",
            "company": "Test Company",
            "phone": "+383 44 999 888",
            "email": "test@multiitem.com",
            "address": "Test Street 123",
            "city": "Prishtina",
            "discount_percent": 5.0
        }, headers=headers)
        
        if response.status_code in [200, 201]:
            return response.json()
        pytest.skip("Could not create test customer")
    
    @pytest.fixture
    def product_data(self, admin_token):
        """Get product catalog data"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        windows = requests.get(f"{BASE_URL}/api/window-types", headers=headers).json()
        doors = requests.get(f"{BASE_URL}/api/door-types", headers=headers).json()
        profiles = requests.get(f"{BASE_URL}/api/profiles", headers=headers).json()
        glass = requests.get(f"{BASE_URL}/api/glass-types", headers=headers).json()
        colors = requests.get(f"{BASE_URL}/api/colors", headers=headers).json()
        
        if not windows or not doors or not profiles or not glass or not colors:
            pytest.skip("Product catalog not seeded")
        
        return {
            "windows": windows,
            "doors": doors,
            "profiles": profiles,
            "glass": glass,
            "colors": colors
        }
    
    def test_create_offer_with_multiple_items(self, admin_token, test_customer, product_data):
        """Test creating an offer with multiple windows and doors"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create offer with 3 items: 2 windows + 1 door
        offer_data = {
            "customer_id": test_customer["id"],
            "items": [
                {
                    "product_type": "window",
                    "product_type_id": product_data["windows"][0]["id"],
                    "width_cm": 120,
                    "height_cm": 150,
                    "quantity": 2,
                    "profile_id": product_data["profiles"][0]["id"],
                    "glass_id": product_data["glass"][0]["id"],
                    "color_id": product_data["colors"][0]["id"],
                    "notes": "Living room windows"
                },
                {
                    "product_type": "window",
                    "product_type_id": product_data["windows"][0]["id"],
                    "width_cm": 80,
                    "height_cm": 100,
                    "quantity": 3,
                    "profile_id": product_data["profiles"][0]["id"],
                    "glass_id": product_data["glass"][0]["id"],
                    "color_id": product_data["colors"][0]["id"],
                    "notes": "Bathroom windows"
                },
                {
                    "product_type": "door",
                    "product_type_id": product_data["doors"][0]["id"],
                    "width_cm": 100,
                    "height_cm": 210,
                    "quantity": 1,
                    "profile_id": product_data["profiles"][0]["id"],
                    "glass_id": product_data["glass"][0]["id"],
                    "color_id": product_data["colors"][0]["id"],
                    "notes": "Main entrance door"
                }
            ],
            "discount_percent": 10.0,
            "vat_percent": 18.0,
            "notes": "TEST offer with multiple items",
            "valid_days": 30
        }
        
        response = requests.post(f"{BASE_URL}/api/offers", json=offer_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify offer structure
        assert "id" in data
        assert "offer_number" in data
        assert "items" in data
        assert len(data["items"]) == 3
        
        # Verify items
        window_items = [i for i in data["items"] if i["product_type"] == "window"]
        door_items = [i for i in data["items"] if i["product_type"] == "door"]
        
        assert len(window_items) == 2
        assert len(door_items) == 1
        
        # Verify pricing calculations
        assert data["subtotal"] > 0
        assert data["discount_percent"] == 10.0
        assert data["discount_amount"] > 0
        assert data["vat_percent"] == 18.0
        assert data["vat_amount"] > 0
        assert data["total"] > 0
        
        print(f"✓ Multi-item offer created: Offer #{data['offer_number']}")
        print(f"  Items: {len(data['items'])} (2 windows, 1 door)")
        print(f"  Subtotal: {data['subtotal']}€")
        print(f"  Discount: {data['discount_amount']}€ ({data['discount_percent']}%)")
        print(f"  VAT: {data['vat_amount']}€ ({data['vat_percent']}%)")
        print(f"  Total: {data['total']}€")
        
        return data
    
    def test_get_offers_list(self, admin_token):
        """Test getting list of offers"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/offers", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        print(f"✓ Offers list retrieved: {len(data)} offers")


class TestPdfDownload:
    """Test PDF download functionality"""
    
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
    
    def test_download_offer_pdf(self, admin_token):
        """Test downloading PDF for an existing offer"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Get list of offers
        response = requests.get(f"{BASE_URL}/api/offers", headers=headers)
        if response.status_code != 200 or not response.json():
            pytest.skip("No offers available for PDF test")
        
        offers = response.json()
        offer_id = offers[0]["id"]
        
        # Download PDF
        response = requests.get(f"{BASE_URL}/api/offers/{offer_id}/pdf", headers=headers)
        
        assert response.status_code == 200
        assert response.headers.get("content-type") == "application/pdf"
        assert len(response.content) > 0
        
        print(f"✓ PDF download successful: {len(response.content)} bytes")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
