#!/usr/bin/env python3
"""
Delivery Partner Authentication Testing Suite
Tests the delivery partner authentication functionality with existing JWT system as requested.
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Any
import sys
import os

# Get backend URL from frontend environment
BACKEND_URL = "https://rider-portal-1.preview.emergentagent.com/api"

class DeliveryPartnerAuthTester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        self.delivery_partner_token = None
        
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
    
    def test_delivery_partner_login(self):
        """Test delivery partner login with specific credentials"""
        try:
            login_data = {
                "email": "delivery@fast.com",
                "password": "password123"
            }
            
            response = self.session.post(f"{self.base_url}/auth/login", json=login_data)
            
            if response.status_code != 200:
                self.log_test("Delivery Partner Login", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return None
            
            data = response.json()
            
            # Validate response structure
            required_fields = ['user', 'token', 'message']
            for field in required_fields:
                if field not in data:
                    self.log_test("Delivery Partner Login", False, 
                                f"Missing field in response: {field}")
                    return None
            
            # Validate user data structure
            user = data['user']
            user_required_fields = ['id', 'name', 'email', 'role', 'roleDisplay', 'created_at']
            for field in user_required_fields:
                if field not in user:
                    self.log_test("Delivery Partner Login", False, 
                                f"Missing user field: {field}")
                    return None
            
            # Validate delivery partner specific data
            if user['role'] != 'delivery_partner':
                self.log_test("Delivery Partner Login", False, 
                            f"Expected role 'delivery_partner', got '{user['role']}'")
                return None
            
            if user['email'] != 'delivery@fast.com':
                self.log_test("Delivery Partner Login", False, 
                            f"Expected email 'delivery@fast.com', got '{user['email']}'")
                return None
            
            # Validate JWT token
            if not data['token'] or len(data['token']) < 10:
                self.log_test("Delivery Partner Login", False, 
                            "JWT token is empty or too short")
                return None
            
            # Store token for later tests
            self.delivery_partner_token = data['token']
            
            self.log_test("Delivery Partner Login", True, 
                        f"Successfully logged in as {user['roleDisplay']}",
                        {
                            "user_name": user['name'],
                            "email": user['email'],
                            "role": user['role'],
                            "roleDisplay": user['roleDisplay'],
                            "token_length": len(data['token']),
                            "message": data['message']
                        })
            
            return data['token']
                
        except Exception as e:
            self.log_test("Delivery Partner Login", False, f"Exception: {str(e)}")
            return None
    
    def test_delivery_partner_profile(self):
        """Test getting delivery partner profile with authentication"""
        if not self.delivery_partner_token:
            self.log_test("Delivery Partner Profile", False, 
                        "No token available - login test must pass first")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.delivery_partner_token}"}
            response = self.session.get(f"{self.base_url}/auth/profile", headers=headers)
            
            if response.status_code != 200:
                self.log_test("Delivery Partner Profile", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            # Validate profile structure
            required_fields = ['id', 'name', 'email', 'role', 'roleDisplay', 'created_at']
            for field in required_fields:
                if field not in data:
                    self.log_test("Delivery Partner Profile", False, 
                                f"Missing field: {field}")
                    return
            
            # Validate delivery partner specific data
            if data['role'] != 'delivery_partner':
                self.log_test("Delivery Partner Profile", False, 
                            f"Expected role 'delivery_partner', got '{data['role']}'")
                return
            
            if data['email'] != 'delivery@fast.com':
                self.log_test("Delivery Partner Profile", False, 
                            f"Expected email 'delivery@fast.com', got '{data['email']}'")
                return
            
            self.log_test("Delivery Partner Profile", True, 
                        f"Retrieved profile for {data['roleDisplay']}",
                        {
                            "user_name": data['name'],
                            "email": data['email'],
                            "role": data['role'],
                            "roleDisplay": data['roleDisplay'],
                            "avatar": data.get('avatar', 'Not provided')
                        })
                
        except Exception as e:
            self.log_test("Delivery Partner Profile", False, f"Exception: {str(e)}")
    
    def test_delivery_partner_dashboard_access(self):
        """Test delivery partner dashboard access with proper role-based access control"""
        if not self.delivery_partner_token:
            self.log_test("Delivery Partner Dashboard Access", False, 
                        "No token available - login test must pass first")
            return
        
        try:
            headers = {"Authorization": f"Bearer {self.delivery_partner_token}"}
            response = self.session.get(f"{self.base_url}/dashboard/delivery-partner", headers=headers)
            
            if response.status_code != 200:
                self.log_test("Delivery Partner Dashboard Access", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            # Validate dashboard response structure
            required_fields = ['dashboard', 'user', 'data']
            for field in required_fields:
                if field not in data:
                    self.log_test("Delivery Partner Dashboard Access", False, 
                                f"Missing field: {field}")
                    return
            
            # Validate dashboard type
            if data['dashboard'] != 'delivery_partner':
                self.log_test("Delivery Partner Dashboard Access", False, 
                            f"Expected dashboard 'delivery_partner', got '{data['dashboard']}'")
                return
            
            # Validate user role in dashboard response
            if data['user']['role'] != 'delivery_partner':
                self.log_test("Delivery Partner Dashboard Access", False, 
                            f"Expected user role 'delivery_partner', got '{data['user']['role']}'")
                return
            
            # Validate dashboard data structure
            dashboard_data = data['data']
            if not isinstance(dashboard_data, dict):
                self.log_test("Delivery Partner Dashboard Access", False, 
                            "Dashboard data should be a dictionary")
                return
            
            # Check for expected delivery partner dashboard fields
            expected_fields = ['active_deliveries', 'completed_today', 'earnings_today', 'rating']
            for field in expected_fields:
                if field not in dashboard_data:
                    self.log_test("Delivery Partner Dashboard Access", False, 
                                f"Missing dashboard field: {field}")
                    return
            
            self.log_test("Delivery Partner Dashboard Access", True, 
                        "Successfully accessed delivery partner dashboard",
                        {
                            "dashboard_type": data['dashboard'],
                            "user_role": data['user']['role'],
                            "active_deliveries": dashboard_data['active_deliveries'],
                            "completed_today": dashboard_data['completed_today'],
                            "earnings_today": dashboard_data['earnings_today'],
                            "rating": dashboard_data['rating']
                        })
                
        except Exception as e:
            self.log_test("Delivery Partner Dashboard Access", False, f"Exception: {str(e)}")
    
    def test_unauthorized_dashboard_access(self):
        """Test that delivery partner cannot access other role dashboards"""
        if not self.delivery_partner_token:
            self.log_test("Unauthorized Dashboard Access Test", False, 
                        "No token available - login test must pass first")
            return
        
        # Test accessing super admin dashboard (should be denied)
        try:
            headers = {"Authorization": f"Bearer {self.delivery_partner_token}"}
            response = self.session.get(f"{self.base_url}/dashboard/super-admin", headers=headers)
            
            if response.status_code == 403:
                self.log_test("Unauthorized Dashboard Access Test", True, 
                            "Correctly denied access to super admin dashboard")
            else:
                self.log_test("Unauthorized Dashboard Access Test", False, 
                            f"Expected 403 Forbidden, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Unauthorized Dashboard Access Test", False, f"Exception: {str(e)}")
    
    def test_token_validation(self):
        """Test JWT token validation and structure"""
        if not self.delivery_partner_token:
            self.log_test("Token Validation", False, 
                        "No token available - login test must pass first")
            return
        
        try:
            # Test token refresh
            headers = {"Authorization": f"Bearer {self.delivery_partner_token}"}
            response = self.session.post(f"{self.base_url}/auth/refresh", headers=headers)
            
            if response.status_code != 200:
                self.log_test("Token Validation", False, 
                            f"Token refresh failed: HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            if 'token' in data and 'message' in data:
                self.log_test("Token Validation", True, 
                            "JWT token validation and refresh working",
                            {
                                "refresh_message": data['message'],
                                "new_token_length": len(data['token'])
                            })
            else:
                self.log_test("Token Validation", False, 
                            "Invalid token refresh response structure")
                
        except Exception as e:
            self.log_test("Token Validation", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all delivery partner authentication tests"""
        print("=" * 80)
        print("DELIVERY PARTNER AUTHENTICATION TESTING SUITE")
        print("=" * 80)
        print(f"Testing backend URL: {self.base_url}")
        print(f"Testing delivery partner credentials: delivery@fast.com / password123")
        print()
        
        # Test 1: Login with delivery partner credentials
        print("🔹 Testing Delivery Partner Login...")
        token = self.test_delivery_partner_login()
        
        if token:
            # Test 2: Get delivery partner profile
            print("\n🔹 Testing Delivery Partner Profile Access...")
            self.test_delivery_partner_profile()
            
            # Test 3: Access delivery partner dashboard
            print("\n🔹 Testing Delivery Partner Dashboard Access...")
            self.test_delivery_partner_dashboard_access()
            
            # Test 4: Test unauthorized access (role-based access control)
            print("\n🔹 Testing Role-based Access Control...")
            self.test_unauthorized_dashboard_access()
            
            # Test 5: Test JWT token validation
            print("\n🔹 Testing JWT Token Validation...")
            self.test_token_validation()
        else:
            print("\n❌ Login failed - skipping subsequent tests")
        
        # Summary
        print("\n" + "=" * 80)
        print("DELIVERY PARTNER AUTHENTICATION TEST SUMMARY")
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
        else:
            print("\n🎉 All delivery partner authentication tests passed!")
        
        return passed == total

def main():
    """Main test execution"""
    print("🚀 Starting Delivery Partner Authentication Testing")
    print("=" * 80)
    
    # Test Delivery Partner Authentication
    tester = DeliveryPartnerAuthTester(BACKEND_URL)
    success = tester.run_all_tests()
    
    # Overall Summary
    print("\n" + "=" * 80)
    print("🎯 FINAL RESULT")
    print("=" * 80)
    
    if success:
        print("✅ DELIVERY PARTNER AUTHENTICATION SYSTEM WORKING!")
        print("   - Login with delivery@fast.com successful")
        print("   - JWT token generation and validation working")
        print("   - Role-based dashboard access control working")
        print("   - User data structure includes all required fields")
        sys.exit(0)
    else:
        print("❌ DELIVERY PARTNER AUTHENTICATION ISSUES FOUND!")
        print("   Check the test details above for specific failures.")
        sys.exit(1)

if __name__ == "__main__":
    main()