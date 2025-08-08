#!/usr/bin/env python3
"""
Backend API Testing Suite for Analytics and Super Admin Endpoints
Tests all analytics and super admin API endpoints for proper functionality and data structure validation.
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Any
import sys
import os

# Get backend URL from environment
BACKEND_URL = "https://d0b7caf5-1672-4c54-912c-643550ed3411.preview.emergentagent.com/api"

class SuperAdminAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def validate_business_user(self, user: Dict) -> tuple[bool, str]:
        """Validate business user data structure"""
        required_fields = [
            'id', 'name', 'email', 'phone', 'role', 'status', 
            'permissions', 'created_at'
        ]
        
        for field in required_fields:
            if field not in user:
                return False, f"Missing field: {field}"
        
        # Validate role values
        valid_roles = ['store_manager', 'vendor', 'delivery_partner', 'support_staff']
        if user['role'] not in valid_roles:
            return False, f"Invalid role: {user['role']}"
        
        # Validate status values
        valid_statuses = ['active', 'inactive', 'suspended', 'on_delivery']
        if user['status'] not in valid_statuses:
            return False, f"Invalid status: {user['status']}"
        
        return True, "Business user structure is valid"
    
    def validate_business_outlet(self, outlet: Dict) -> tuple[bool, str]:
        """Validate business outlet data structure"""
        required_fields = [
            'id', 'name', 'address', 'city', 'state', 'zip_code',
            'phone', 'email', 'business_hours', 'status', 'created_at'
        ]
        
        for field in required_fields:
            if field not in outlet:
                return False, f"Missing field: {field}"
        
        # Validate business_hours structure
        if not isinstance(outlet['business_hours'], dict):
            return False, "business_hours should be a dictionary"
        
        return True, "Business outlet structure is valid"
    
    def validate_product(self, product: Dict) -> tuple[bool, str]:
        """Validate product data structure"""
        required_fields = [
            'id', 'name', 'description', 'category', 'price', 'cost',
            'sku', 'status', 'inventory_count', 'min_stock_level',
            'outlet_ids', 'created_at'
        ]
        
        for field in required_fields:
            if field not in product:
                return False, f"Missing field: {field}"
        
        # Validate numeric fields
        if not isinstance(product['price'], (int, float)):
            return False, "price should be numeric"
        
        if not isinstance(product['cost'], (int, float)):
            return False, "cost should be numeric"
        
        return True, "Product structure is valid"
    
    def validate_order(self, order: Dict) -> tuple[bool, str]:
        """Validate order data structure"""
        required_fields = [
            'id', 'order_number', 'customer_id', 'customer_name',
            'customer_phone', 'customer_email', 'outlet_id', 'items',
            'subtotal', 'tax', 'delivery_fee', 'total', 'status',
            'payment_status', 'payment_method', 'delivery_address',
            'created_at', 'updated_at'
        ]
        
        for field in required_fields:
            if field not in order:
                return False, f"Missing field: {field}"
        
        # Validate items structure
        if not isinstance(order['items'], list):
            return False, "items should be a list"
        
        return True, "Order structure is valid"
    
    def validate_dashboard_data(self, data: Dict) -> tuple[bool, str]:
        """Validate dashboard analytics data structure"""
        required_fields = [
            'total_revenue', 'revenue_growth', 'total_orders', 'pending_orders',
            'active_customers', 'top_products', 'sales_by_outlet', 'recent_orders'
        ]
        
        for field in required_fields:
            if field not in data:
                return False, f"Missing field: {field}"
        
        # Validate nested structures
        if not isinstance(data['top_products'], list):
            return False, "top_products should be a list"
        
        if not isinstance(data['sales_by_outlet'], list):
            return False, "sales_by_outlet should be a list"
        
        if not isinstance(data['recent_orders'], list):
            return False, "recent_orders should be a list"
        
        return True, "Dashboard data structure is valid"
    
    # User Management API Tests
    def test_get_business_users(self):
        """Test GET /api/super-admin/users endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/super-admin/users")
            
            if response.status_code != 200:
                self.log_test("Get Business Users", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if not isinstance(data, list):
                self.log_test("Get Business Users", False, "Response is not a list")
                return
            
            if len(data) == 0:
                self.log_test("Get Business Users", False, "Empty user list")
                return
            
            # Validate first user structure
            is_valid, message = self.validate_business_user(data[0])
            
            if is_valid:
                self.log_test("Get Business Users", True, 
                            f"Retrieved {len(data)} business users",
                            {"sample_user": data[0]['name'], "roles": [u['role'] for u in data]})
            else:
                self.log_test("Get Business Users", False, message)
                
        except Exception as e:
            self.log_test("Get Business Users", False, f"Exception: {str(e)}")
    
    def test_create_business_user(self):
        """Test POST /api/super-admin/users endpoint"""
        try:
            new_user = {
                "name": "Test Manager",
                "email": "test.manager@business.com",
                "phone": "+1-555-9999",
                "role": "store_manager",
                "status": "active",
                "outlet_id": "out_001",
                "permissions": ["manage_orders", "view_analytics"]
            }
            
            response = self.session.post(f"{self.base_url}/super-admin/users", json=new_user)
            
            if response.status_code not in [200, 201]:
                self.log_test("Create Business User", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_business_user(data)
            
            if is_valid and data['name'] == new_user['name']:
                self.log_test("Create Business User", True, 
                            "User created successfully",
                            {"created_user": data['name'], "id": data['id']})
            else:
                self.log_test("Create Business User", False, 
                            f"Validation failed: {message}")
                
        except Exception as e:
            self.log_test("Create Business User", False, f"Exception: {str(e)}")
    
    def test_update_business_user(self):
        """Test PUT /api/super-admin/users/{user_id} endpoint"""
        try:
            user_id = "usr_001"
            updated_user = {
                "name": "Updated Manager Name",
                "email": "updated.manager@business.com",
                "phone": "+1-555-8888",
                "role": "store_manager",
                "status": "active",
                "outlet_id": "out_001",
                "permissions": ["manage_orders", "view_analytics", "manage_inventory"]
            }
            
            response = self.session.put(f"{self.base_url}/super-admin/users/{user_id}", json=updated_user)
            
            if response.status_code != 200:
                self.log_test("Update Business User", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if data['id'] == user_id and data['name'] == updated_user['name']:
                self.log_test("Update Business User", True, 
                            "User updated successfully",
                            {"updated_user": data['name'], "permissions_count": len(data['permissions'])})
            else:
                self.log_test("Update Business User", False, 
                            "Update validation failed")
                
        except Exception as e:
            self.log_test("Update Business User", False, f"Exception: {str(e)}")
    
    def test_delete_business_user(self):
        """Test DELETE /api/super-admin/users/{user_id} endpoint"""
        try:
            user_id = "usr_test_delete"
            response = self.session.delete(f"{self.base_url}/super-admin/users/{user_id}")
            
            if response.status_code != 200:
                self.log_test("Delete Business User", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if 'message' in data and user_id in data['message']:
                self.log_test("Delete Business User", True, 
                            "User deleted successfully",
                            {"response": data['message']})
            else:
                self.log_test("Delete Business User", False, 
                            "Delete response validation failed")
                
        except Exception as e:
            self.log_test("Delete Business User", False, f"Exception: {str(e)}")
    
    # Outlet Management API Tests
    def test_get_outlets(self):
        """Test GET /api/super-admin/outlets endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/super-admin/outlets")
            
            if response.status_code != 200:
                self.log_test("Get Outlets", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if not isinstance(data, list):
                self.log_test("Get Outlets", False, "Response is not a list")
                return
            
            if len(data) == 0:
                self.log_test("Get Outlets", False, "Empty outlet list")
                return
            
            # Validate first outlet structure
            is_valid, message = self.validate_business_outlet(data[0])
            
            if is_valid:
                self.log_test("Get Outlets", True, 
                            f"Retrieved {len(data)} outlets",
                            {"sample_outlet": data[0]['name'], "cities": [o['city'] for o in data]})
            else:
                self.log_test("Get Outlets", False, message)
                
        except Exception as e:
            self.log_test("Get Outlets", False, f"Exception: {str(e)}")
    
    def test_create_outlet(self):
        """Test POST /api/super-admin/outlets endpoint"""
        try:
            new_outlet = {
                "name": "Test Outlet",
                "address": "123 Test Street",
                "city": "Test City",
                "state": "TS",
                "zip_code": "12345",
                "phone": "+1-555-7777",
                "email": "test@outlet.com",
                "business_hours": {
                    "monday": {"open": "09:00", "close": "18:00"},
                    "tuesday": {"open": "09:00", "close": "18:00"}
                },
                "status": "active"
            }
            
            response = self.session.post(f"{self.base_url}/super-admin/outlets", json=new_outlet)
            
            if response.status_code not in [200, 201]:
                self.log_test("Create Outlet", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_business_outlet(data)
            
            if is_valid and data['name'] == new_outlet['name']:
                self.log_test("Create Outlet", True, 
                            "Outlet created successfully",
                            {"created_outlet": data['name'], "id": data['id']})
            else:
                self.log_test("Create Outlet", False, 
                            f"Validation failed: {message}")
                
        except Exception as e:
            self.log_test("Create Outlet", False, f"Exception: {str(e)}")
    
    def test_update_outlet(self):
        """Test PUT /api/super-admin/outlets/{outlet_id} endpoint"""
        try:
            outlet_id = "out_001"
            updated_outlet = {
                "name": "Updated Downtown Store",
                "address": "456 Updated Street",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001",
                "phone": "+1-555-6666",
                "email": "updated@outlet.com",
                "business_hours": {
                    "monday": {"open": "08:00", "close": "21:00"},
                    "tuesday": {"open": "08:00", "close": "21:00"}
                },
                "status": "active"
            }
            
            response = self.session.put(f"{self.base_url}/super-admin/outlets/{outlet_id}", json=updated_outlet)
            
            if response.status_code != 200:
                self.log_test("Update Outlet", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if data['id'] == outlet_id and data['name'] == updated_outlet['name']:
                self.log_test("Update Outlet", True, 
                            "Outlet updated successfully",
                            {"updated_outlet": data['name'], "address": data['address']})
            else:
                self.log_test("Update Outlet", False, 
                            "Update validation failed")
                
        except Exception as e:
            self.log_test("Update Outlet", False, f"Exception: {str(e)}")
    
    # Product Management API Tests
    def test_get_products(self):
        """Test GET /api/super-admin/products endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/super-admin/products")
            
            if response.status_code != 200:
                self.log_test("Get Products", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if not isinstance(data, list):
                self.log_test("Get Products", False, "Response is not a list")
                return
            
            if len(data) == 0:
                self.log_test("Get Products", False, "Empty product list")
                return
            
            # Validate first product structure
            is_valid, message = self.validate_product(data[0])
            
            if is_valid:
                self.log_test("Get Products", True, 
                            f"Retrieved {len(data)} products",
                            {"sample_product": data[0]['name'], "categories": list(set([p['category'] for p in data]))})
            else:
                self.log_test("Get Products", False, message)
                
        except Exception as e:
            self.log_test("Get Products", False, f"Exception: {str(e)}")
    
    def test_create_product(self):
        """Test POST /api/super-admin/products endpoint"""
        try:
            new_product = {
                "name": "Test Product",
                "description": "A test product for API testing",
                "category": "Test Category",
                "price": 19.99,
                "cost": 12.50,
                "sku": "TEST-001",
                "barcode": "9876543210987",
                "status": "active",
                "inventory_count": 100,
                "min_stock_level": 10,
                "outlet_ids": ["out_001"]
            }
            
            response = self.session.post(f"{self.base_url}/super-admin/products", json=new_product)
            
            if response.status_code not in [200, 201]:
                self.log_test("Create Product", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_product(data)
            
            if is_valid and data['name'] == new_product['name']:
                self.log_test("Create Product", True, 
                            "Product created successfully",
                            {"created_product": data['name'], "id": data['id'], "price": data['price']})
            else:
                self.log_test("Create Product", False, 
                            f"Validation failed: {message}")
                
        except Exception as e:
            self.log_test("Create Product", False, f"Exception: {str(e)}")
    
    def test_update_product(self):
        """Test PUT /api/super-admin/products/{product_id} endpoint"""
        try:
            product_id = "prd_001"
            updated_product = {
                "name": "Updated Organic Apples",
                "description": "Premium organic red apples, locally sourced and updated",
                "category": "Premium Fruits",
                "price": 4.99,
                "cost": 3.00,
                "sku": "ORG-APL-001-UPD",
                "barcode": "1234567890123",
                "status": "active",
                "inventory_count": 200,
                "min_stock_level": 25,
                "outlet_ids": ["out_001", "out_002"]
            }
            
            response = self.session.put(f"{self.base_url}/super-admin/products/{product_id}", json=updated_product)
            
            if response.status_code != 200:
                self.log_test("Update Product", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if data['id'] == product_id and data['name'] == updated_product['name']:
                self.log_test("Update Product", True, 
                            "Product updated successfully",
                            {"updated_product": data['name'], "new_price": data['price']})
            else:
                self.log_test("Update Product", False, 
                            "Update validation failed")
                
        except Exception as e:
            self.log_test("Update Product", False, f"Exception: {str(e)}")
    
    def test_delete_product(self):
        """Test DELETE /api/super-admin/products/{product_id} endpoint"""
        try:
            product_id = "prd_test_delete"
            response = self.session.delete(f"{self.base_url}/super-admin/products/{product_id}")
            
            if response.status_code != 200:
                self.log_test("Delete Product", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if 'message' in data and product_id in data['message']:
                self.log_test("Delete Product", True, 
                            "Product deleted successfully",
                            {"response": data['message']})
            else:
                self.log_test("Delete Product", False, 
                            "Delete response validation failed")
                
        except Exception as e:
            self.log_test("Delete Product", False, f"Exception: {str(e)}")
    
    # Order Management API Tests
    def test_get_orders(self):
        """Test GET /api/super-admin/orders endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/super-admin/orders")
            
            if response.status_code != 200:
                self.log_test("Get Orders", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if not isinstance(data, list):
                self.log_test("Get Orders", False, "Response is not a list")
                return
            
            if len(data) == 0:
                self.log_test("Get Orders", False, "Empty order list")
                return
            
            # Validate first order structure
            is_valid, message = self.validate_order(data[0])
            
            if is_valid:
                self.log_test("Get Orders", True, 
                            f"Retrieved {len(data)} orders",
                            {"sample_order": data[0]['order_number'], "statuses": [o['status'] for o in data]})
            else:
                self.log_test("Get Orders", False, message)
                
        except Exception as e:
            self.log_test("Get Orders", False, f"Exception: {str(e)}")
    
    def test_get_orders_with_status_filter(self):
        """Test GET /api/super-admin/orders?status=delivered endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/super-admin/orders?status=delivered")
            
            if response.status_code != 200:
                self.log_test("Get Orders (status filter)", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if not isinstance(data, list):
                self.log_test("Get Orders (status filter)", False, "Response is not a list")
                return
            
            # Check if all returned orders have the correct status
            all_delivered = all(order['status'] == 'delivered' for order in data)
            
            if all_delivered:
                self.log_test("Get Orders (status filter)", True, 
                            f"Retrieved {len(data)} delivered orders",
                            {"filtered_status": "delivered"})
            else:
                self.log_test("Get Orders (status filter)", False, 
                            "Status filter not working correctly")
                
        except Exception as e:
            self.log_test("Get Orders (status filter)", False, f"Exception: {str(e)}")
    
    def test_get_orders_with_outlet_filter(self):
        """Test GET /api/super-admin/orders?outlet_id=out_001 endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/super-admin/orders?outlet_id=out_001")
            
            if response.status_code != 200:
                self.log_test("Get Orders (outlet filter)", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if not isinstance(data, list):
                self.log_test("Get Orders (outlet filter)", False, "Response is not a list")
                return
            
            # Check if all returned orders have the correct outlet_id
            all_correct_outlet = all(order['outlet_id'] == 'out_001' for order in data)
            
            if all_correct_outlet:
                self.log_test("Get Orders (outlet filter)", True, 
                            f"Retrieved {len(data)} orders for outlet out_001",
                            {"filtered_outlet": "out_001"})
            else:
                self.log_test("Get Orders (outlet filter)", False, 
                            "Outlet filter not working correctly")
                
        except Exception as e:
            self.log_test("Get Orders (outlet filter)", False, f"Exception: {str(e)}")
    
    def test_update_order_status(self):
        """Test PUT /api/super-admin/orders/{order_id}/status endpoint"""
        try:
            order_id = "ord_001"
            new_status = "preparing"
            
            response = self.session.put(f"{self.base_url}/super-admin/orders/{order_id}/status", 
                                      params={"status": new_status})
            
            if response.status_code != 200:
                self.log_test("Update Order Status", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if 'message' in data and order_id in data['message'] and new_status in data['message']:
                self.log_test("Update Order Status", True, 
                            "Order status updated successfully",
                            {"response": data['message']})
            else:
                self.log_test("Update Order Status", False, 
                            "Status update response validation failed")
                
        except Exception as e:
            self.log_test("Update Order Status", False, f"Exception: {str(e)}")
    
    # Analytics API Test
    def test_get_business_dashboard(self):
        """Test GET /api/super-admin/analytics/dashboard endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/super-admin/analytics/dashboard")
            
            if response.status_code != 200:
                self.log_test("Get Business Dashboard", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_dashboard_data(data)
            
            if is_valid:
                self.log_test("Get Business Dashboard", True, 
                            "Dashboard data retrieved successfully",
                            {
                                "total_revenue": data['total_revenue'],
                                "total_orders": data['total_orders'],
                                "top_products_count": len(data['top_products']),
                                "outlets_count": len(data['sales_by_outlet'])
                            })
            else:
                self.log_test("Get Business Dashboard", False, message)
                
        except Exception as e:
            self.log_test("Get Business Dashboard", False, f"Exception: {str(e)}")
    
    def run_all_super_admin_tests(self):
        """Run all Super Admin API tests"""
        print("=" * 80)
        print("SUPER ADMIN API TESTING SUITE")
        print("=" * 80)
        print(f"Testing backend URL: {self.base_url}")
        print()
        
        # User Management Tests
        print("🔹 Testing User Management APIs...")
        self.test_get_business_users()
        self.test_create_business_user()
        self.test_update_business_user()
        self.test_delete_business_user()
        
        # Outlet Management Tests
        print("\n🔹 Testing Outlet Management APIs...")
        self.test_get_outlets()
        self.test_create_outlet()
        self.test_update_outlet()
        
        # Product Management Tests
        print("\n🔹 Testing Product Management APIs...")
        self.test_get_products()
        self.test_create_product()
        self.test_update_product()
        self.test_delete_product()
        
        # Order Management Tests
        print("\n🔹 Testing Order Management APIs...")
        self.test_get_orders()
        self.test_get_orders_with_status_filter()
        self.test_get_orders_with_outlet_filter()
        self.test_update_order_status()
        
        # Analytics Test
        print("\n🔹 Testing Analytics APIs...")
        self.test_get_business_dashboard()
        
        # Summary
        print("\n" + "=" * 80)
        print("SUPER ADMIN API TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total


class AnalyticsAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def validate_revenue_metrics(self, data: List[Dict]) -> tuple[bool, str]:
        """Validate revenue metrics data structure"""
        if not isinstance(data, list):
            return False, "Response is not a list"
        
        if len(data) == 0:
            return False, "Empty data list"
        
        required_fields = [
            'date', 'total_revenue', 'tenant_count', 'avg_revenue_per_tenant',
            'subscription_revenue', 'transaction_revenue', 'growth_rate'
        ]
        
        for item in data[:3]:  # Check first 3 items
            for field in required_fields:
                if field not in item:
                    return False, f"Missing field: {field}"
            
            # Validate data types
            if not isinstance(item['total_revenue'], (int, float)):
                return False, f"total_revenue should be numeric, got {type(item['total_revenue'])}"
            
            if not isinstance(item['tenant_count'], int):
                return False, f"tenant_count should be integer, got {type(item['tenant_count'])}"
            
            # Validate date format
            try:
                datetime.strptime(item['date'], '%Y-%m-%d')
            except ValueError:
                return False, f"Invalid date format: {item['date']}"
        
        return True, "Revenue metrics structure is valid"
    
    def validate_user_behavior_metrics(self, data: List[Dict]) -> tuple[bool, str]:
        """Validate user behavior metrics data structure"""
        if not isinstance(data, list):
            return False, "Response is not a list"
        
        if len(data) == 0:
            return False, "Empty data list"
        
        required_fields = [
            'date', 'daily_active_users', 'monthly_active_users', 'session_duration_avg',
            'page_views', 'feature_usage', 'login_frequency', 'user_retention_rate'
        ]
        
        for item in data[:3]:  # Check first 3 items
            for field in required_fields:
                if field not in item:
                    return False, f"Missing field: {field}"
            
            # Validate nested objects
            if not isinstance(item['feature_usage'], dict):
                return False, "feature_usage should be a dictionary"
            
            if not isinstance(item['login_frequency'], dict):
                return False, "login_frequency should be a dictionary"
        
        return True, "User behavior metrics structure is valid"
    
    def validate_performance_metrics(self, data: List[Dict]) -> tuple[bool, str]:
        """Validate performance metrics data structure"""
        if not isinstance(data, list):
            return False, "Response is not a list"
        
        if len(data) == 0:
            return False, "Empty data list"
        
        required_fields = [
            'timestamp', 'api_response_time', 'error_rate', 'uptime_percentage',
            'cpu_usage', 'memory_usage', 'database_connections', 'active_sessions'
        ]
        
        for item in data[:3]:  # Check first 3 items
            for field in required_fields:
                if field not in item:
                    return False, f"Missing field: {field}"
        
        return True, "Performance metrics structure is valid"
    
    def validate_analytics_summary(self, data: Dict) -> tuple[bool, str]:
        """Validate analytics summary data structure"""
        if not isinstance(data, dict):
            return False, "Response is not a dictionary"
        
        required_fields = [
            'total_revenue', 'revenue_growth', 'total_users', 'active_users',
            'conversion_rate', 'churn_rate', 'avg_session_duration', 'system_uptime'
        ]
        
        for field in required_fields:
            if field not in data:
                return False, f"Missing field: {field}"
        
        return True, "Analytics summary structure is valid"
    
    def validate_tenant_performance(self, data: List[Dict]) -> tuple[bool, str]:
        """Validate tenant performance data structure"""
        if not isinstance(data, list):
            return False, "Response is not a list"
        
        if len(data) == 0:
            return False, "Empty data list"
        
        required_fields = [
            'tenant_name', 'monthly_revenue', 'monthly_orders', 'avg_order_value',
            'customer_count', 'growth_rate', 'satisfaction_score'
        ]
        
        for item in data[:3]:  # Check first 3 items
            for field in required_fields:
                if field not in item:
                    return False, f"Missing field: {field}"
        
        return True, "Tenant performance structure is valid"
    
    def validate_geographic_data(self, data: Dict) -> tuple[bool, str]:
        """Validate geographic analytics data structure"""
        if not isinstance(data, dict):
            return False, "Response is not a dictionary"
        
        if 'revenue_by_region' not in data:
            return False, "Missing revenue_by_region field"
        
        if 'top_cities' not in data:
            return False, "Missing top_cities field"
        
        # Validate revenue_by_region structure
        if not isinstance(data['revenue_by_region'], list):
            return False, "revenue_by_region should be a list"
        
        # Validate top_cities structure
        if not isinstance(data['top_cities'], list):
            return False, "top_cities should be a list"
        
        return True, "Geographic data structure is valid"
    
    def test_revenue_analytics(self):
        """Test GET /api/analytics/revenue endpoint"""
        try:
            # Test with default parameters
            response = self.session.get(f"{self.base_url}/analytics/revenue")
            
            if response.status_code != 200:
                self.log_test("Revenue Analytics (default)", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_revenue_metrics(data)
            
            if is_valid:
                self.log_test("Revenue Analytics (default)", True, 
                            f"Retrieved {len(data)} revenue records", 
                            {"sample_record": data[0] if data else None})
            else:
                self.log_test("Revenue Analytics (default)", False, message)
            
            # Test with custom days parameter
            response = self.session.get(f"{self.base_url}/analytics/revenue?days=7")
            
            if response.status_code == 200:
                data = response.json()
                if len(data) == 7:
                    self.log_test("Revenue Analytics (days=7)", True, 
                                f"Retrieved exactly 7 records as requested")
                else:
                    self.log_test("Revenue Analytics (days=7)", False, 
                                f"Expected 7 records, got {len(data)}")
            else:
                self.log_test("Revenue Analytics (days=7)", False, 
                            f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Revenue Analytics", False, f"Exception: {str(e)}")
    
    def test_user_behavior_analytics(self):
        """Test GET /api/analytics/user-behavior endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/analytics/user-behavior")
            
            if response.status_code != 200:
                self.log_test("User Behavior Analytics", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_user_behavior_metrics(data)
            
            if is_valid:
                self.log_test("User Behavior Analytics", True, 
                            f"Retrieved {len(data)} behavior records",
                            {"sample_features": data[0]['feature_usage'] if data else None})
            else:
                self.log_test("User Behavior Analytics", False, message)
                
        except Exception as e:
            self.log_test("User Behavior Analytics", False, f"Exception: {str(e)}")
    
    def test_performance_analytics(self):
        """Test GET /api/analytics/performance endpoint"""
        try:
            # Test with default parameters
            response = self.session.get(f"{self.base_url}/analytics/performance")
            
            if response.status_code != 200:
                self.log_test("Performance Analytics (default)", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_performance_metrics(data)
            
            if is_valid:
                self.log_test("Performance Analytics (default)", True, 
                            f"Retrieved {len(data)} performance records")
            else:
                self.log_test("Performance Analytics (default)", False, message)
            
            # Test with custom hours parameter
            response = self.session.get(f"{self.base_url}/analytics/performance?hours=12")
            
            if response.status_code == 200:
                data = response.json()
                if len(data) == 12:
                    self.log_test("Performance Analytics (hours=12)", True, 
                                f"Retrieved exactly 12 records as requested")
                else:
                    self.log_test("Performance Analytics (hours=12)", False, 
                                f"Expected 12 records, got {len(data)}")
            else:
                self.log_test("Performance Analytics (hours=12)", False, 
                            f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Performance Analytics", False, f"Exception: {str(e)}")
    
    def test_analytics_summary(self):
        """Test GET /api/analytics/summary endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/analytics/summary")
            
            if response.status_code != 200:
                self.log_test("Analytics Summary", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_analytics_summary(data)
            
            if is_valid:
                self.log_test("Analytics Summary", True, 
                            "Summary data structure is valid",
                            {"total_revenue": data.get('total_revenue'), 
                             "active_users": data.get('active_users')})
            else:
                self.log_test("Analytics Summary", False, message)
                
        except Exception as e:
            self.log_test("Analytics Summary", False, f"Exception: {str(e)}")
    
    def test_tenant_performance_analytics(self):
        """Test GET /api/analytics/tenant-performance endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/analytics/tenant-performance")
            
            if response.status_code != 200:
                self.log_test("Tenant Performance Analytics", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_tenant_performance(data)
            
            if is_valid:
                self.log_test("Tenant Performance Analytics", True, 
                            f"Retrieved {len(data)} tenant records",
                            {"top_tenant": data[0]['tenant_name'] if data else None})
            else:
                self.log_test("Tenant Performance Analytics", False, message)
                
        except Exception as e:
            self.log_test("Tenant Performance Analytics", False, f"Exception: {str(e)}")
    
    def test_geographic_analytics(self):
        """Test GET /api/analytics/geographic endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/analytics/geographic")
            
            if response.status_code != 200:
                self.log_test("Geographic Analytics", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            is_valid, message = self.validate_geographic_data(data)
            
            if is_valid:
                regions_count = len(data.get('revenue_by_region', []))
                cities_count = len(data.get('top_cities', []))
                self.log_test("Geographic Analytics", True, 
                            f"Retrieved {regions_count} regions and {cities_count} cities",
                            {"top_region": data['revenue_by_region'][0]['region'] if data.get('revenue_by_region') else None})
            else:
                self.log_test("Geographic Analytics", False, message)
                
        except Exception as e:
            self.log_test("Geographic Analytics", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all analytics API tests"""
        print("=" * 80)
        print("ANALYTICS API TESTING SUITE")
        print("=" * 80)
        print(f"Testing backend URL: {self.base_url}")
        print()
        
        # Run all tests
        self.test_revenue_analytics()
        self.test_user_behavior_analytics()
        self.test_performance_analytics()
        self.test_analytics_summary()
        self.test_tenant_performance_analytics()
        self.test_geographic_analytics()
        
        # Summary
        print("\n" + "=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main test execution"""
    print("🚀 Starting Comprehensive Backend API Testing Suite")
    print("=" * 80)
    
    # Test Analytics APIs
    analytics_tester = AnalyticsAPITester(BACKEND_URL)
    analytics_success = analytics_tester.run_all_tests()
    
    print("\n" + "=" * 80)
    
    # Test Super Admin APIs
    super_admin_tester = SuperAdminAPITester(BACKEND_URL)
    super_admin_success = super_admin_tester.run_all_super_admin_tests()
    
    # Overall Summary
    print("\n" + "=" * 80)
    print("🎯 OVERALL TEST SUMMARY")
    print("=" * 80)
    
    analytics_passed = sum(1 for result in analytics_tester.test_results if result['success'])
    analytics_total = len(analytics_tester.test_results)
    
    super_admin_passed = sum(1 for result in super_admin_tester.test_results if result['success'])
    super_admin_total = len(super_admin_tester.test_results)
    
    total_passed = analytics_passed + super_admin_passed
    total_tests = analytics_total + super_admin_total
    
    print(f"Analytics API Tests: {analytics_passed}/{analytics_total} passed")
    print(f"Super Admin API Tests: {super_admin_passed}/{super_admin_total} passed")
    print(f"Overall: {total_passed}/{total_tests} passed ({(total_passed/total_tests)*100:.1f}%)")
    
    if analytics_success and super_admin_success:
        print("\n🎉 All backend API tests passed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()