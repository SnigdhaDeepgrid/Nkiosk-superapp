#!/usr/bin/env python3
"""
Authentication and Multi-Role Backend API Testing Suite
Tests authentication endpoints and role-based access for the multi-role portal system.
Roles: saas_admin, super_admin, store_manager, vendor, delivery_partner, customer, support_staff
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Any
import sys
import os

# Get backend URL from environment
BACKEND_URL = "https://rider-portal-1.preview.emergentagent.com/api"

class AuthenticationTester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        self.auth_token = None
        
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
    
    def test_login_endpoint(self):
        """Test POST /api/auth/login endpoint"""
        try:
            # Test with different user roles
            test_users = [
                {"email": "admin@saas.com", "password": "admin123", "expected_role": "saas_admin"},
                {"email": "super@admin.com", "password": "super123", "expected_role": "super_admin"},
                {"email": "manager@store.com", "password": "manager123", "expected_role": "store_manager"},
                {"email": "vendor@business.com", "password": "vendor123", "expected_role": "vendor"},
                {"email": "driver@delivery.com", "password": "driver123", "expected_role": "delivery_partner"},
                {"email": "customer@email.com", "password": "customer123", "expected_role": "customer"},
                {"email": "support@help.com", "password": "support123", "expected_role": "support_staff"}
            ]
            
            for user in test_users:
                response = self.session.post(f"{self.base_url}/auth/login", json={
                    "email": user["email"],
                    "password": user["password"]
                })
                
                if response.status_code == 404:
                    self.log_test(f"Login Endpoint ({user['expected_role']})", False, 
                                "Authentication endpoint not found - /api/auth/login does not exist",
                                {"status_code": 404, "role": user["expected_role"]})
                elif response.status_code == 200:
                    data = response.json()
                    if 'token' in data and 'user' in data:
                        self.log_test(f"Login Endpoint ({user['expected_role']})", True, 
                                    "Login successful",
                                    {"role": data.get('user', {}).get('role'), "has_token": 'token' in data})
                        if user["expected_role"] == "super_admin":
                            self.auth_token = data.get('token')
                    else:
                        self.log_test(f"Login Endpoint ({user['expected_role']})", False, 
                                    "Login response missing required fields")
                else:
                    self.log_test(f"Login Endpoint ({user['expected_role']})", False, 
                                f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Login Endpoint", False, f"Exception: {str(e)}")
    
    def test_register_endpoint(self):
        """Test POST /api/auth/register endpoint"""
        try:
            new_user = {
                "name": "Test User",
                "email": "test@newuser.com",
                "password": "testpass123",
                "role": "customer",
                "phone": "+1-555-0123"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=new_user)
            
            if response.status_code == 404:
                self.log_test("Register Endpoint", False, 
                            "Registration endpoint not found - /api/auth/register does not exist",
                            {"status_code": 404})
            elif response.status_code in [200, 201]:
                data = response.json()
                if 'user' in data:
                    self.log_test("Register Endpoint", True, 
                                "Registration successful",
                                {"user_id": data.get('user', {}).get('id')})
                else:
                    self.log_test("Register Endpoint", False, 
                                "Registration response missing user data")
            else:
                self.log_test("Register Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Register Endpoint", False, f"Exception: {str(e)}")
    
    def test_logout_endpoint(self):
        """Test POST /api/auth/logout endpoint"""
        try:
            headers = {}
            if self.auth_token:
                headers['Authorization'] = f'Bearer {self.auth_token}'
            
            response = self.session.post(f"{self.base_url}/auth/logout", headers=headers)
            
            if response.status_code == 404:
                self.log_test("Logout Endpoint", False, 
                            "Logout endpoint not found - /api/auth/logout does not exist",
                            {"status_code": 404})
            elif response.status_code == 200:
                self.log_test("Logout Endpoint", True, "Logout successful")
            else:
                self.log_test("Logout Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Logout Endpoint", False, f"Exception: {str(e)}")
    
    def test_profile_endpoint(self):
        """Test GET /api/auth/profile endpoint"""
        try:
            headers = {}
            if self.auth_token:
                headers['Authorization'] = f'Bearer {self.auth_token}'
            
            response = self.session.get(f"{self.base_url}/auth/profile", headers=headers)
            
            if response.status_code == 404:
                self.log_test("Profile Endpoint", False, 
                            "Profile endpoint not found - /api/auth/profile does not exist",
                            {"status_code": 404})
            elif response.status_code == 200:
                data = response.json()
                if 'user' in data:
                    self.log_test("Profile Endpoint", True, 
                                "Profile retrieved successfully",
                                {"user_role": data.get('user', {}).get('role')})
                else:
                    self.log_test("Profile Endpoint", False, 
                                "Profile response missing user data")
            else:
                self.log_test("Profile Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Profile Endpoint", False, f"Exception: {str(e)}")
    
    def test_refresh_token_endpoint(self):
        """Test POST /api/auth/refresh endpoint"""
        try:
            headers = {}
            if self.auth_token:
                headers['Authorization'] = f'Bearer {self.auth_token}'
            
            response = self.session.post(f"{self.base_url}/auth/refresh", headers=headers)
            
            if response.status_code == 404:
                self.log_test("Refresh Token Endpoint", False, 
                            "Refresh token endpoint not found - /api/auth/refresh does not exist",
                            {"status_code": 404})
            elif response.status_code == 200:
                data = response.json()
                if 'token' in data:
                    self.log_test("Refresh Token Endpoint", True, 
                                "Token refreshed successfully")
                else:
                    self.log_test("Refresh Token Endpoint", False, 
                                "Refresh response missing token")
            else:
                self.log_test("Refresh Token Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Refresh Token Endpoint", False, f"Exception: {str(e)}")
    
    def test_password_reset_endpoint(self):
        """Test POST /api/auth/forgot-password endpoint"""
        try:
            response = self.session.post(f"{self.base_url}/auth/forgot-password", json={
                "email": "test@user.com"
            })
            
            if response.status_code == 404:
                self.log_test("Password Reset Endpoint", False, 
                            "Password reset endpoint not found - /api/auth/forgot-password does not exist",
                            {"status_code": 404})
            elif response.status_code == 200:
                self.log_test("Password Reset Endpoint", True, 
                            "Password reset request processed")
            else:
                self.log_test("Password Reset Endpoint", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Password Reset Endpoint", False, f"Exception: {str(e)}")
    
    def test_role_based_dashboard_access(self):
        """Test role-based dashboard access endpoints"""
        dashboard_endpoints = [
            {"endpoint": "/dashboard/saas-admin", "role": "saas_admin"},
            {"endpoint": "/dashboard/super-admin", "role": "super_admin"},
            {"endpoint": "/dashboard/store-manager", "role": "store_manager"},
            {"endpoint": "/dashboard/vendor", "role": "vendor"},
            {"endpoint": "/dashboard/delivery-partner", "role": "delivery_partner"},
            {"endpoint": "/dashboard/customer", "role": "customer"},
            {"endpoint": "/dashboard/support-staff", "role": "support_staff"}
        ]
        
        for dashboard in dashboard_endpoints:
            try:
                headers = {}
                if self.auth_token:
                    headers['Authorization'] = f'Bearer {self.auth_token}'
                
                response = self.session.get(f"{self.base_url}{dashboard['endpoint']}", headers=headers)
                
                if response.status_code == 404:
                    self.log_test(f"Dashboard Access ({dashboard['role']})", False, 
                                f"Dashboard endpoint not found - {dashboard['endpoint']} does not exist",
                                {"status_code": 404, "role": dashboard["role"]})
                elif response.status_code == 200:
                    self.log_test(f"Dashboard Access ({dashboard['role']})", True, 
                                "Dashboard accessible")
                elif response.status_code == 401:
                    self.log_test(f"Dashboard Access ({dashboard['role']})", False, 
                                "Unauthorized access - authentication required")
                elif response.status_code == 403:
                    self.log_test(f"Dashboard Access ({dashboard['role']})", False, 
                                "Forbidden access - insufficient permissions")
                else:
                    self.log_test(f"Dashboard Access ({dashboard['role']})", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Dashboard Access ({dashboard['role']})", False, f"Exception: {str(e)}")
    
    def test_middleware_protection(self):
        """Test if existing endpoints are protected by authentication middleware"""
        protected_endpoints = [
            "/super-admin/users",
            "/super-admin/outlets", 
            "/super-admin/products",
            "/super-admin/orders",
            "/super-admin/analytics/dashboard"
        ]
        
        for endpoint in protected_endpoints:
            try:
                # Test without authentication
                response = self.session.get(f"{self.base_url}{endpoint}")
                
                if response.status_code == 200:
                    self.log_test(f"Middleware Protection ({endpoint})", False, 
                                "Endpoint accessible without authentication - security risk!",
                                {"status_code": 200, "endpoint": endpoint})
                elif response.status_code == 401:
                    self.log_test(f"Middleware Protection ({endpoint})", True, 
                                "Endpoint properly protected - requires authentication")
                elif response.status_code == 403:
                    self.log_test(f"Middleware Protection ({endpoint})", True, 
                                "Endpoint properly protected - requires authorization")
                else:
                    self.log_test(f"Middleware Protection ({endpoint})", False, 
                                f"Unexpected response: HTTP {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Middleware Protection ({endpoint})", False, f"Exception: {str(e)}")
    
    def run_all_authentication_tests(self):
        """Run all authentication and role-based access tests"""
        print("=" * 80)
        print("AUTHENTICATION & MULTI-ROLE ACCESS TESTING SUITE")
        print("=" * 80)
        print(f"Testing backend URL: {self.base_url}")
        print("Expected Roles: saas_admin, super_admin, store_manager, vendor, delivery_partner, customer, support_staff")
        print()
        
        # Authentication Endpoints Tests
        print("🔹 Testing Authentication Endpoints...")
        self.test_login_endpoint()
        self.test_register_endpoint()
        self.test_logout_endpoint()
        self.test_profile_endpoint()
        self.test_refresh_token_endpoint()
        self.test_password_reset_endpoint()
        
        # Role-based Dashboard Access Tests
        print("\n🔹 Testing Role-based Dashboard Access...")
        self.test_role_based_dashboard_access()
        
        # Security Middleware Tests
        print("\n🔹 Testing Authentication Middleware Protection...")
        self.test_middleware_protection()
        
        # Summary
        print("\n" + "=" * 80)
        print("AUTHENTICATION TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%" if total > 0 else "No tests run")
        
        # Critical Issues Analysis
        auth_endpoints_missing = sum(1 for result in self.test_results 
                                   if not result['success'] and 'not found' in result['message'])
        unprotected_endpoints = sum(1 for result in self.test_results 
                                  if not result['success'] and 'security risk' in result['message'])
        
        print(f"\n🚨 CRITICAL SECURITY ANALYSIS:")
        print(f"Missing Authentication Endpoints: {auth_endpoints_missing}")
        print(f"Unprotected Sensitive Endpoints: {unprotected_endpoints}")
        
        if auth_endpoints_missing > 0:
            print("\n❌ CRITICAL ISSUE: Authentication system is not implemented!")
            print("   Missing endpoints prevent users from logging in and accessing role-based dashboards.")
        
        if unprotected_endpoints > 0:
            print("\n❌ SECURITY RISK: Sensitive endpoints are accessible without authentication!")
            print("   This allows unauthorized access to admin functions and sensitive data.")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main test execution"""
    print("🔐 Starting Authentication & Multi-Role Backend API Testing")
    print("=" * 80)
    
    # Test Authentication System
    auth_tester = AuthenticationTester(BACKEND_URL)
    auth_success = auth_tester.run_all_authentication_tests()
    
    # Overall Summary
    print("\n" + "=" * 80)
    print("🎯 AUTHENTICATION SYSTEM STATUS")
    print("=" * 80)
    
    if auth_success:
        print("✅ Authentication system is fully implemented and working!")
    else:
        print("❌ Authentication system has critical issues that need immediate attention!")
        print("\nRECOMMENDATIONS:")
        print("1. Implement missing authentication endpoints (/api/auth/login, /api/auth/register, etc.)")
        print("2. Add JWT token-based authentication middleware")
        print("3. Implement role-based access control (RBAC)")
        print("4. Protect sensitive endpoints with authentication requirements")
        print("5. Add proper error handling for authentication failures")
    
    return auth_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)