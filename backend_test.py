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
        self.admin_token = None
        self.test_appointment_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers, timeout=30)

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
        
        # First get available slots
        success, slots_response = self.run_test(
            "Get Available Slots for Booking", 
            "GET", 
            "appointments/available", 
            200, 
            params={"date": tomorrow}
        )
        
        if not success or not slots_response.get('available_slots'):
            print("❌ No available slots found for booking test")
            return False, {}
        
        # Use the first available slot
        available_time = slots_response['available_slots'][0]
        
        appointment_data = {
            "name": "Test User Booking",
            "email": "testbooking@example.com",
            "company": "Test Booking Company",
            "date": tomorrow,
            "time": available_time,
            "topic": "strategy",
            "notes": "This is a test appointment booking.",
            "language": "en"
        }
        success, response = self.run_test("Book Appointment", "POST", "appointments", 200, appointment_data)
        if success and 'appointment_id' in response:
            self.test_appointment_id = response['appointment_id']
        return success, response

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

    def test_lead_magnet(self):
        """Test lead magnet form submission"""
        lead_data = {
            "name": "Test Lead",
            "email": "testlead@example.com",
            "company": "Test Lead Company",
            "language": "en"
        }
        return self.run_test("Lead Magnet Submission", "POST", "leads", 200, lead_data)

    def test_admin_login(self):
        """Test admin login"""
        login_data = {
            "password": "admin2026!"
        }
        success, response = self.run_test("Admin Login", "POST", "admin/login", 200, login_data)
        if success and 'token' in response:
            self.admin_token = response['token']
        return success, response

    def test_admin_stats(self):
        """Test admin stats endpoint (requires auth)"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping admin stats test")
            return False, {}
        
        headers = {"x-admin-token": self.admin_token}
        return self.run_test("Admin Stats", "GET", "admin/stats", 200, headers=headers)

    def test_pdf_download(self):
        """Test PDF guide download (Phase 3 feature)"""
        success, response = self.run_test("PDF Guide Download", "GET", "leads/guide-pdf", 200)
        return success, response

    def test_admin_notifications(self):
        """Test admin notifications endpoint (Phase 3 feature)"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping admin notifications test")
            return False, {}
        
        headers = {"x-admin-token": self.admin_token}
        return self.run_test("Admin Notifications", "GET", "admin/notifications", 200, headers=headers)

    def test_mark_notification_read(self):
        """Test marking notification as read (Phase 3 feature)"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping mark notification read test")
            return False, {}
        
        # First get notifications to find one to mark as read
        headers = {"x-admin-token": self.admin_token}
        success, response = self.run_test("Get Notifications for Read Test", "GET", "admin/notifications", 200, headers=headers)
        
        if not success or not response.get('notifications'):
            print("❌ No notifications found to mark as read")
            return False, {}
        
        # Find an unread notification
        unread_notif = None
        for notif in response['notifications']:
            if not notif.get('read', True):
                unread_notif = notif
                break
        
        if not unread_notif:
            print("❌ No unread notifications found to test mark as read")
            return False, {}
        
        # Mark it as read
        notif_id = unread_notif['notification_id']
        success, response = self.run_test(
            f"Mark Notification {notif_id[:8]}... as Read", 
            "PUT", 
            f"admin/notifications/{notif_id}/read", 
            200, 
            headers=headers
        )
        return success, response

    def test_mark_all_notifications_read(self):
        """Test marking all notifications as read (Phase 3 feature)"""
        if not self.admin_token:
            print("❌ Admin token not available, skipping mark all notifications read test")
            return False, {}
        
        headers = {"x-admin-token": self.admin_token}
        return self.run_test("Mark All Notifications Read", "PUT", "admin/notifications/read-all", 200, headers=headers)

    def test_calendar_download(self):
        """Test ICS calendar download"""
        if not self.test_appointment_id:
            print("❌ No appointment ID available, skipping calendar download test")
            return False, {}
        
        success, response = self.run_test(
            "Calendar ICS Download", 
            "GET", 
            f"appointments/{self.test_appointment_id}/calendar", 
            200
        )
        return success, response

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
        tester.test_calendar_download,  # Test ICS download after booking
        tester.test_ai_chat,
        tester.test_get_contacts,
        tester.test_lead_magnet,  # Phase 2 feature
        tester.test_pdf_download,  # Phase 3 feature - PDF generation
        tester.test_admin_login,  # Phase 2 feature
        tester.test_admin_stats,  # Phase 2 feature (requires login)
        tester.test_admin_notifications,  # Phase 3 feature - Admin notifications
        tester.test_mark_notification_read,  # Phase 3 feature - Mark notification read
        tester.test_mark_all_notifications_read,  # Phase 3 feature - Mark all read
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