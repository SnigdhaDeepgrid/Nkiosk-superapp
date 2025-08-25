#!/usr/bin/env python3
"""
Frontend Authentication Flow Testing
Tests the authentication flow to identify why login dashboards are not working
"""

import requests
import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import sys

# Frontend URL from environment
FRONTEND_URL = "https://rider-portal-1.preview.emergentagent.com"

class FrontendAuthTester:
    def __init__(self):
        self.results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: dict = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_frontend_accessibility(self):
        """Test if frontend is accessible"""
        try:
            response = requests.get(FRONTEND_URL, timeout=10)
            if response.status_code == 200:
                self.log_test("Frontend Accessibility", True, 
                            f"Frontend accessible at {FRONTEND_URL}")
                return True
            else:
                self.log_test("Frontend Accessibility", False, 
                            f"HTTP {response.status_code}: {response.text[:200]}")
                return False
        except Exception as e:
            self.log_test("Frontend Accessibility", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_page_loads(self):
        """Test if auth page loads properly"""
        try:
            response = requests.get(f"{FRONTEND_URL}/auth", timeout=10)
            if response.status_code == 200:
                # Check if the response contains expected login form elements
                content = response.text.lower()
                has_login_form = any(keyword in content for keyword in [
                    'login', 'email', 'password', 'sign in', 'nkiosk'
                ])
                
                if has_login_form:
                    self.log_test("Auth Page Load", True, 
                                "Auth page loads with login form elements")
                    return True
                else:
                    self.log_test("Auth Page Load", False, 
                                "Auth page loads but missing login form elements")
                    return False
            else:
                self.log_test("Auth Page Load", False, 
                            f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Auth Page Load", False, f"Exception: {str(e)}")
            return False
    
    def test_dashboard_redirect_without_auth(self):
        """Test if dashboard redirects to auth when not authenticated"""
        try:
            response = requests.get(f"{FRONTEND_URL}/dashboard", 
                                  timeout=10, allow_redirects=False)
            
            # Check if it's a redirect (3xx status code)
            if 300 <= response.status_code < 400:
                self.log_test("Dashboard Redirect (No Auth)", True, 
                            f"Dashboard correctly redirects (HTTP {response.status_code})")
                return True
            elif response.status_code == 200:
                # If it returns 200, check if it's actually the auth page content
                content = response.text.lower()
                has_auth_content = any(keyword in content for keyword in [
                    'login', 'sign in', 'email', 'password'
                ])
                
                if has_auth_content:
                    self.log_test("Dashboard Redirect (No Auth)", True, 
                                "Dashboard shows auth page content (client-side routing)")
                    return True
                else:
                    self.log_test("Dashboard Redirect (No Auth)", False, 
                                "Dashboard accessible without authentication")
                    return False
            else:
                self.log_test("Dashboard Redirect (No Auth)", False, 
                            f"Unexpected HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Dashboard Redirect (No Auth)", False, f"Exception: {str(e)}")
            return False
    
    def test_javascript_console_errors(self):
        """Test for JavaScript console errors using headless browser"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            driver = webdriver.Chrome(options=chrome_options)
            driver.get(f"{FRONTEND_URL}/auth")
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Get console logs
            logs = driver.get_log('browser')
            errors = [log for log in logs if log['level'] == 'SEVERE']
            warnings = [log for log in logs if log['level'] == 'WARNING']
            
            driver.quit()
            
            if errors:
                error_messages = [log['message'] for log in errors]
                self.log_test("JavaScript Console Errors", False, 
                            f"Found {len(errors)} console errors",
                            {"errors": error_messages})
                return False
            else:
                warning_count = len(warnings)
                self.log_test("JavaScript Console Errors", True, 
                            f"No console errors found ({warning_count} warnings)")
                return True
                
        except Exception as e:
            self.log_test("JavaScript Console Errors", False, 
                        f"Browser test failed: {str(e)}")
            return False
    
    def test_login_form_interaction(self):
        """Test login form interaction and submission"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            driver = webdriver.Chrome(options=chrome_options)
            driver.get(f"{FRONTEND_URL}/auth")
            
            # Wait for login form to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
            )
            
            # Find form elements
            email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            
            # Test SaaS Admin login
            email_input.clear()
            email_input.send_keys("admin@saas.com")
            password_input.clear()
            password_input.send_keys("password123")
            
            # Get current URL before submission
            current_url_before = driver.current_url
            
            # Submit form
            submit_button.click()
            
            # Wait a bit for navigation
            time.sleep(3)
            
            # Check if URL changed (indicating navigation)
            current_url_after = driver.current_url
            
            # Check localStorage for user data
            user_data = driver.execute_script("return localStorage.getItem('user');")
            
            driver.quit()
            
            # Analyze results
            url_changed = current_url_before != current_url_after
            has_user_data = user_data is not None
            
            if url_changed and '/dashboard' in current_url_after:
                self.log_test("Login Form Interaction", True, 
                            "Login successful - navigated to dashboard",
                            {
                                "url_before": current_url_before,
                                "url_after": current_url_after,
                                "has_user_data": has_user_data
                            })
                return True
            elif has_user_data and not url_changed:
                self.log_test("Login Form Interaction", False, 
                            "Login sets user data but doesn't navigate",
                            {
                                "url_before": current_url_before,
                                "url_after": current_url_after,
                                "user_data": user_data[:100] if user_data else None
                            })
                return False
            else:
                self.log_test("Login Form Interaction", False, 
                            "Login form submission failed",
                            {
                                "url_before": current_url_before,
                                "url_after": current_url_after,
                                "has_user_data": has_user_data
                            })
                return False
                
        except Exception as e:
            self.log_test("Login Form Interaction", False, 
                        f"Browser interaction failed: {str(e)}")
            return False
    
    def test_protected_route_with_manual_localstorage(self):
        """Test protected route access with manually set localStorage"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            driver = webdriver.Chrome(options=chrome_options)
            
            # First go to the site to set localStorage
            driver.get(FRONTEND_URL)
            
            # Set user data in localStorage
            user_data = {
                "id": "1",
                "name": "John Smith",
                "email": "admin@saas.com",
                "role": "saas_admin",
                "roleDisplay": "SaaS Admin"
            }
            
            driver.execute_script(
                f"localStorage.setItem('user', '{json.dumps(user_data)}');"
            )
            
            # Now navigate to dashboard
            driver.get(f"{FRONTEND_URL}/dashboard")
            
            # Wait for page to load
            time.sleep(3)
            
            # Check current URL
            current_url = driver.current_url
            
            # Check if we're still on dashboard or redirected to auth
            is_on_dashboard = '/dashboard' in current_url
            is_redirected_to_auth = '/auth' in current_url
            
            # Check page content for dashboard elements
            page_source = driver.page_source.lower()
            has_dashboard_content = any(keyword in page_source for keyword in [
                'saas administration', 'dashboard', 'tenants', 'analytics'
            ])
            
            driver.quit()
            
            if is_on_dashboard and has_dashboard_content:
                self.log_test("Protected Route (Manual localStorage)", True, 
                            "Dashboard accessible with localStorage user data",
                            {"url": current_url})
                return True
            elif is_redirected_to_auth:
                self.log_test("Protected Route (Manual localStorage)", False, 
                            "Dashboard redirects to auth despite localStorage user data",
                            {"url": current_url})
                return False
            else:
                self.log_test("Protected Route (Manual localStorage)", False, 
                            "Dashboard page loads but missing expected content",
                            {
                                "url": current_url,
                                "has_dashboard_content": has_dashboard_content
                            })
                return False
                
        except Exception as e:
            self.log_test("Protected Route (Manual localStorage)", False, 
                        f"Browser test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all frontend authentication tests"""
        print("=" * 80)
        print("FRONTEND AUTHENTICATION TESTING SUITE")
        print("=" * 80)
        print(f"Testing frontend URL: {FRONTEND_URL}")
        print()
        
        # Run tests in order
        tests = [
            self.test_frontend_accessibility,
            self.test_auth_page_loads,
            self.test_dashboard_redirect_without_auth,
            self.test_javascript_console_errors,
            self.test_login_form_interaction,
            self.test_protected_route_with_manual_localstorage
        ]
        
        for test in tests:
            test()
            print()  # Add spacing between tests
        
        # Summary
        print("=" * 80)
        print("FRONTEND AUTHENTICATION TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.results if result['success'])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
                    if result['details']:
                        for key, value in result['details'].items():
                            print(f"    {key}: {value}")
        
        return passed == total

def main():
    """Main test execution"""
    print("🚀 Starting Frontend Authentication Testing Suite")
    print("=" * 80)
    
    tester = FrontendAuthTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All frontend authentication tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some frontend authentication tests failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()