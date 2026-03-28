import requests
import sys
import json
from datetime import datetime, timedelta

class PortfolioAPITester:
    def __init__(self, base_url="https://431d7cfe-13f1-4820-b439-b46ebb1e1b0a.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}")

            return success, response.json() if response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Company",
            "subject": "Test Subject",
            "message": "This is a test message for the contact form.",
            "language": "en"
        }
        return self.run_test("Contact Form Submission", "POST", "contact", 200, contact_data)

    def test_available_appointments(self):
        """Test getting available appointment slots"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        return self.run_test(
            "Get Available Appointments", 
            "GET", 
            "appointments/available", 
            200, 
            params={"date": tomorrow}
        )

    def test_book_appointment(self):
        """Test booking an appointment"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        appointment_data = {
            "name": "Test User",
            "email": "test@example.com",
            "company": "Test Company",
            "date": tomorrow,
            "time": "10:00",
            "topic": "strategy",
            "notes": "This is a test appointment booking.",
            "language": "en"
        }
        return self.run_test("Book Appointment", "POST", "appointments", 200, appointment_data)

    def test_ai_chat(self):
        """Test AI chat functionality"""
        chat_data = {
            "session_id": self.session_id,
            "message": "Hello, I'm interested in AI consulting services. Can you tell me more?",
            "language": "en"
        }
        return self.run_test("AI Chat", "POST", "chat", 200, chat_data)

    def test_get_contacts(self):
        """Test getting contacts (admin endpoint)"""
        return self.run_test("Get Contacts", "GET", "contacts", 200)

def main():
    print("🚀 Starting Portfolio API Tests...")
    print("=" * 60)
    
    tester = PortfolioAPITester()
    
    # Run all tests
    tests = [
        tester.test_health_check,
        tester.test_contact_form,
        tester.test_available_appointments,
        tester.test_book_appointment,
        tester.test_ai_chat,
        tester.test_get_contacts,
    ]
    
    for test in tests:
        test()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())