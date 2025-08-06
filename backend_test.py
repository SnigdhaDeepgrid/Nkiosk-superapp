#!/usr/bin/env python3
"""
Backend API Testing Suite for Analytics Endpoints
Tests all analytics API endpoints for proper functionality and data structure validation.
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Any
import sys
import os

# Get backend URL from environment
BACKEND_URL = "https://6503cd5b-81c1-4c8a-b51b-feb688db4a37.preview.emergentagent.com/api"

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
    tester = AnalyticsAPITester(BACKEND_URL)
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All analytics API tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()