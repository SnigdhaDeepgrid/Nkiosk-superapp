#!/usr/bin/env python3
"""
Simple Frontend Authentication Testing
Tests the frontend authentication without browser automation
"""

import requests
import json
import sys

# Frontend URL from environment
FRONTEND_URL = "https://rider-portal-1.preview.emergentagent.com"

class SimpleFrontendTester:
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
                has_login_elements = {
                    'nkiosk_title': 'nkiosk' in content,
                    'email_input': 'email' in content and 'input' in content,
                    'password_input': 'password' in content and 'input' in content,
                    'signin_button': 'sign in' in content or 'login' in content,
                    'demo_accounts': 'demo accounts' in content or 'admin@saas.com' in content
                }
                
                missing_elements = [k for k, v in has_login_elements.items() if not v]
                
                if not missing_elements:
                    self.log_test("Auth Page Load", True, 
                                "Auth page loads with all expected elements",
                                {"elements_found": list(has_login_elements.keys())})
                    return True
                else:
                    self.log_test("Auth Page Load", False, 
                                f"Auth page missing elements: {missing_elements}",
                                {"elements_status": has_login_elements})
                    return False
            else:
                self.log_test("Auth Page Load", False, 
                            f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Auth Page Load", False, f"Exception: {str(e)}")
            return False
    
    def test_dashboard_route_response(self):
        """Test dashboard route response"""
        try:
            response = requests.get(f"{FRONTEND_URL}/dashboard", 
                                  timeout=10, allow_redirects=True)
            
            if response.status_code == 200:
                content = response.text.lower()
                
                # Check if it's showing auth page (client-side routing)
                has_auth_content = any(keyword in content for keyword in [
                    'sign in to dashboard', 'email address', 'password', 'demo accounts'
                ])
                
                # Check if it's showing dashboard content
                has_dashboard_content = any(keyword in content for keyword in [
                    'saas administration', 'dashboard', 'tenants', 'analytics'
                ])
                
                if has_auth_content and not has_dashboard_content:
                    self.log_test("Dashboard Route Response", True, 
                                "Dashboard correctly shows auth page (client-side routing)")
                    return True
                elif has_dashboard_content:
                    self.log_test("Dashboard Route Response", False, 
                                "Dashboard accessible without authentication")
                    return False
                else:
                    self.log_test("Dashboard Route Response", False, 
                                "Dashboard shows unexpected content",
                                {"has_auth": has_auth_content, "has_dashboard": has_dashboard_content})
                    return False
            else:
                self.log_test("Dashboard Route Response", False, 
                            f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Dashboard Route Response", False, f"Exception: {str(e)}")
            return False
    
    def test_static_assets_loading(self):
        """Test if static assets (JS/CSS) are loading properly"""
        try:
            response = requests.get(FRONTEND_URL, timeout=10)
            if response.status_code != 200:
                self.log_test("Static Assets Loading", False, 
                            f"Main page not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Extract JS and CSS file references
            import re
            js_files = re.findall(r'src="([^"]*\.js[^"]*)"', content)
            css_files = re.findall(r'href="([^"]*\.css[^"]*)"', content)
            
            failed_assets = []
            
            # Test a few key assets
            for asset_url in (js_files + css_files)[:5]:  # Test first 5 assets
                if asset_url.startswith('/'):
                    full_url = FRONTEND_URL + asset_url
                elif asset_url.startswith('http'):
                    full_url = asset_url
                else:
                    continue
                
                try:
                    asset_response = requests.get(full_url, timeout=5)
                    if asset_response.status_code != 200:
                        failed_assets.append(f"{asset_url} (HTTP {asset_response.status_code})")
                except Exception as e:
                    failed_assets.append(f"{asset_url} (Error: {str(e)})")
            
            if not failed_assets:
                self.log_test("Static Assets Loading", True, 
                            f"All tested assets loading properly ({len(js_files)} JS, {len(css_files)} CSS)")
                return True
            else:
                self.log_test("Static Assets Loading", False, 
                            f"Some assets failed to load",
                            {"failed_assets": failed_assets})
                return False
                
        except Exception as e:
            self.log_test("Static Assets Loading", False, f"Exception: {str(e)}")
            return False
    
    def test_react_app_structure(self):
        """Test if React app structure is present"""
        try:
            response = requests.get(FRONTEND_URL, timeout=10)
            if response.status_code != 200:
                self.log_test("React App Structure", False, 
                            f"Main page not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for React app indicators
            react_indicators = {
                'root_div': 'id="root"' in content,
                'react_scripts': any(keyword in content.lower() for keyword in ['react', 'bundle']),
                'app_title': 'nkiosk' in content.lower(),
                'meta_viewport': 'viewport' in content.lower(),
                'manifest': 'manifest.json' in content
            }
            
            missing_indicators = [k for k, v in react_indicators.items() if not v]
            
            if not missing_indicators:
                self.log_test("React App Structure", True, 
                            "React app structure is properly set up",
                            {"indicators_found": list(react_indicators.keys())})
                return True
            else:
                self.log_test("React App Structure", False, 
                            f"Missing React indicators: {missing_indicators}",
                            {"indicators_status": react_indicators})
                return False
                
        except Exception as e:
            self.log_test("React App Structure", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all simple frontend tests"""
        print("=" * 80)
        print("SIMPLE FRONTEND TESTING SUITE")
        print("=" * 80)
        print(f"Testing frontend URL: {FRONTEND_URL}")
        print()
        
        # Run tests in order
        tests = [
            self.test_frontend_accessibility,
            self.test_react_app_structure,
            self.test_static_assets_loading,
            self.test_auth_page_loads,
            self.test_dashboard_route_response
        ]
        
        for test in tests:
            test()
            print()  # Add spacing between tests
        
        # Summary
        print("=" * 80)
        print("SIMPLE FRONTEND TEST SUMMARY")
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
    print("🚀 Starting Simple Frontend Testing Suite")
    print("=" * 80)
    
    tester = SimpleFrontendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All simple frontend tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some simple frontend tests failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()