import os
import io
import uuid
import asyncio
import hashlib
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from pydantic import BaseModel
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage
from fpdf import FPDF

app = FastAPI(title="AI Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin2026!")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

contacts_collection = db["contacts"]
appointments_collection = db["appointments"]
chats_collection = db["chats"]
leads_collection = db["leads"]
notifications_collection = db["notifications"]

chat_sessions = {}


# --- Models ---

class ContactForm(BaseModel):
    name: str
    email: str
    company: Optional[str] = ""
    subject: str
    message: str
    language: Optional[str] = "en"

class AppointmentForm(BaseModel):
    name: str
    email: str
    company: Optional[str] = ""
    date: str
    time: str
    topic: str
    notes: Optional[str] = ""
    language: Optional[str] = "en"

class ChatMessage(BaseModel):
    session_id: str
    message: str
    language: Optional[str] = "en"

class LeadForm(BaseModel):
    name: str
    email: str
    company: Optional[str] = ""
    language: Optional[str] = "en"

class AdminLogin(BaseModel):
    password: str


# --- Helpers ---

def verify_admin(x_admin_token: str = Header(None)):
    expected = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()
    if x_admin_token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")


async def create_notification(notif_type: str, title: str, message: str, meta: dict = None):
    notif_doc = {
        "notification_id": str(uuid.uuid4()),
        "type": notif_type,
        "title": title,
        "message": message,
        "meta": meta or {},
        "read": False,
        "email_sent": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await notifications_collection.insert_one(notif_doc)


def generate_lead_magnet_pdf():
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=20)

    # Cover Page
    pdf.add_page()
    pdf.set_fill_color(15, 23, 42)
    pdf.rect(0, 0, 210, 297, "F")

    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 32)
    pdf.set_y(80)
    pdf.cell(0, 15, "5 Steps to Integrate", ln=True, align="C")
    pdf.cell(0, 15, "AI in Your Business", ln=True, align="C")

    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(148, 163, 184)
    pdf.set_y(130)
    pdf.cell(0, 10, "A Practical Guide by AI-First Consulting", ln=True, align="C")

    pdf.set_font("Helvetica", "", 11)
    pdf.set_y(260)
    pdf.cell(0, 8, "AI-First Consulting | ai-first-consulting.com", ln=True, align="C")
    pdf.cell(0, 8, f"Published {datetime.now().strftime('%B %Y')}", ln=True, align="C")

    # Introduction
    pdf.add_page()
    pdf.set_fill_color(255, 255, 255)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_text_color(15, 23, 42)

    pdf.set_font("Helvetica", "B", 24)
    pdf.cell(0, 15, "Introduction", ln=True)
    pdf.ln(5)

    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(71, 85, 105)
    intro = (
        "Artificial Intelligence is no longer a futuristic concept - it's a present-day competitive advantage. "
        "Companies that strategically integrate AI into their operations are seeing dramatic improvements "
        "in efficiency, decision-making, and customer experience.\n\n"
        "However, many businesses struggle with where to start. This guide provides a clear, actionable "
        "framework for identifying AI opportunities in your organization, building a realistic implementation "
        "roadmap, and measuring the return on your AI investment.\n\n"
        "Whether you're a startup looking to build AI-first products or an enterprise seeking to modernize "
        "legacy systems, these five steps will help you navigate the AI integration journey with confidence."
    )
    pdf.multi_cell(0, 7, intro)

    # Steps
    steps = [
        {
            "title": "Step 1: Audit Your Current Processes",
            "content": (
                "Before implementing any AI solution, you need to understand where AI can have the "
                "greatest impact in your organization.\n\n"
                "Key Actions:\n"
                "- Map all business processes and identify repetitive, data-heavy tasks\n"
                "- Look for bottlenecks where human decision-making slows operations\n"
                "- Assess data availability and quality for each process\n"
                "- Calculate the cost of current inefficiencies\n"
                "- Prioritize opportunities by potential ROI and feasibility\n\n"
                "The goal is to find processes where AI can automate routine work, enhance human "
                "decision-making with data insights, or create entirely new capabilities that weren't "
                "possible before."
            ),
        },
        {
            "title": "Step 2: Define Success Metrics & KPIs",
            "content": (
                "Clear metrics are essential for measuring AI project success and justifying "
                "continued investment.\n\n"
                "Key Actions:\n"
                "- Set baseline measurements for current process performance\n"
                "- Define specific, measurable goals (e.g., 40% reduction in processing time)\n"
                "- Establish both leading indicators (model accuracy) and lagging indicators (revenue impact)\n"
                "- Create a timeline with milestones for review\n"
                "- Plan for A/B testing to compare AI vs. traditional approaches\n\n"
                "Common AI KPIs include: processing speed improvement, error rate reduction, "
                "customer satisfaction scores, cost savings, and revenue per employee."
            ),
        },
        {
            "title": "Step 3: Choose the Right AI Technologies",
            "content": (
                "Not all AI is created equal. Selecting the right technology stack for your specific "
                "use case is critical.\n\n"
                "Key Actions:\n"
                "- Evaluate whether you need ML, NLP, Computer Vision, or a combination\n"
                "- Consider build vs. buy vs. integrate decisions\n"
                "- Assess cloud AI services (AWS, Azure, Google) vs. custom models\n"
                "- Factor in data privacy, compliance, and security requirements\n"
                "- Plan for scalability from pilot to enterprise deployment\n\n"
                "For most businesses, starting with pre-built AI APIs and services is the fastest "
                "path to value. Custom model development becomes important as your AI maturity grows."
            ),
        },
        {
            "title": "Step 4: Build a Phased Implementation Roadmap",
            "content": (
                "Successful AI adoption happens incrementally, not all at once. A phased approach "
                "reduces risk and builds organizational confidence.\n\n"
                "Key Actions:\n"
                "- Phase 1 (Weeks 1-4): Proof of concept with a single, high-impact use case\n"
                "- Phase 2 (Weeks 5-12): Pilot deployment with real users and data\n"
                "- Phase 3 (Months 4-6): Production rollout with monitoring and optimization\n"
                "- Phase 4 (Months 7+): Scale to additional use cases and departments\n\n"
                "Each phase should have clear go/no-go criteria. Don't be afraid to pivot or "
                "adjust based on what you learn during early phases."
            ),
        },
        {
            "title": "Step 5: Measure, Iterate & Scale",
            "content": (
                "AI implementation is not a one-time project - it's an ongoing capability that "
                "improves with time and data.\n\n"
                "Key Actions:\n"
                "- Monitor model performance continuously against your KPIs\n"
                "- Collect user feedback and incorporate it into model improvements\n"
                "- Retrain models regularly with new data to prevent drift\n"
                "- Document lessons learned and share across the organization\n"
                "- Identify new AI opportunities based on success of initial projects\n\n"
                "Organizations that treat AI as a living, evolving capability rather than a static "
                "deployment consistently achieve better long-term results."
            ),
        },
    ]

    for step in steps:
        pdf.add_page()
        pdf.set_text_color(15, 23, 42)
        pdf.set_font("Helvetica", "B", 22)
        pdf.cell(0, 14, step["title"], ln=True)
        pdf.ln(5)

        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(0, 7, step["content"])

    # Closing Page
    pdf.add_page()
    pdf.set_fill_color(37, 99, 235)
    pdf.rect(0, 0, 210, 297, "F")
    pdf.set_text_color(255, 255, 255)

    pdf.set_font("Helvetica", "B", 28)
    pdf.set_y(80)
    pdf.cell(0, 14, "Ready to Get Started?", ln=True, align="C")

    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(219, 234, 254)
    pdf.set_y(110)
    pdf.multi_cell(0, 8, (
        "Book a free 30-minute consultation with our AI experts.\n"
        "We'll help you identify the best AI opportunities\n"
        "for your specific business needs."
    ), align="C")

    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(255, 255, 255)
    pdf.set_y(160)
    pdf.cell(0, 10, "Visit: ai-first-consulting.com/consultation", ln=True, align="C")
    pdf.cell(0, 10, "Email: consulting@ai-first.com", ln=True, align="C")

    pdf.set_font("Helvetica", "", 10)
    pdf.set_y(260)
    pdf.set_text_color(191, 219, 254)
    pdf.cell(0, 8, "AI-First Consulting - Transforming Ideas into Intelligent Applications", ln=True, align="C")

    return pdf.output()


# --- Routes ---

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


# Contact Form
@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    contact_id = str(uuid.uuid4())
    contact_doc = {
        "contact_id": contact_id,
        "name": form.name,
        "email": form.email,
        "company": form.company,
        "subject": form.subject,
        "message": form.message,
        "language": form.language,
        "status": "received",
        "email_sent": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await contacts_collection.insert_one(contact_doc)
    await create_notification(
        "contact",
        f"New Contact: {form.name}",
        f"Subject: {form.subject}\nFrom: {form.email}\nCompany: {form.company or 'N/A'}",
        {"contact_id": contact_id, "email": form.email},
    )
    return {
        "status": "success",
        "contact_id": contact_id,
        "message": "Contact form submitted successfully. We will get back to you soon.",
        "email_sent": False,
    }


@app.get("/api/contacts")
async def get_contacts():
    contacts = await contacts_collection.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"contacts": contacts}


# Appointments
@app.post("/api/appointments")
async def create_appointment(form: AppointmentForm):
    appointment_id = str(uuid.uuid4())
    existing = await appointments_collection.find_one({
        "date": form.date, "time": form.time, "status": {"$ne": "cancelled"}
    }, {"_id": 0})
    if existing:
        raise HTTPException(status_code=409, detail="This time slot is already booked.")

    topic_labels = {
        "strategy": "AI Strategy & Roadmap",
        "development": "Custom AI App Development",
        "integration": "AI Integration",
        "analytics": "Data Analytics & Visualization",
        "automation": "Intelligent Process Automation",
        "other": "Consultation",
    }
    appointment_doc = {
        "appointment_id": appointment_id,
        "name": form.name,
        "email": form.email,
        "company": form.company,
        "date": form.date,
        "time": form.time,
        "topic": form.topic,
        "notes": form.notes,
        "language": form.language,
        "status": "confirmed",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await appointments_collection.insert_one(appointment_doc)
    await create_notification(
        "appointment",
        f"New Consultation: {form.name}",
        f"Date: {form.date} at {form.time}\nTopic: {topic_labels.get(form.topic, form.topic)}\nEmail: {form.email}",
        {"appointment_id": appointment_id, "email": form.email, "date": form.date, "time": form.time},
    )
    return {
        "status": "success",
        "appointment_id": appointment_id,
        "message": "Appointment booked successfully!",
        "appointment": {"date": form.date, "time": form.time, "topic": form.topic},
    }


@app.get("/api/appointments/available")
async def get_available_slots(date: str):
    booked = await appointments_collection.find(
        {"date": date, "status": {"$ne": "cancelled"}}, {"_id": 0, "time": 1}
    ).to_list(100)
    booked_times = [b["time"] for b in booked]
    all_slots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00",
    ]
    return {"date": date, "available_slots": [s for s in all_slots if s not in booked_times], "booked_slots": booked_times}


# Calendar ICS generation
@app.get("/api/appointments/{appointment_id}/calendar")
async def get_calendar_invite(appointment_id: str):
    appt = await appointments_collection.find_one({"appointment_id": appointment_id}, {"_id": 0})
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    dt_start = datetime.strptime(f"{appt['date']} {appt['time']}", "%Y-%m-%d %H:%M")
    dt_end = dt_start + timedelta(minutes=30)
    topic_labels = {"strategy": "AI Strategy & Roadmap", "development": "Custom AI App Development", "integration": "AI Integration", "analytics": "Data Analytics & Visualization", "automation": "Intelligent Process Automation", "other": "Consultation"}
    topic = topic_labels.get(appt.get("topic", "other"), "AI Consultation")
    ics = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI-First Consulting//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:{appointment_id}@ai-first-consulting
DTSTAMP:{datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")}
DTSTART:{dt_start.strftime("%Y%m%dT%H%M%S")}
DTEND:{dt_end.strftime("%Y%m%dT%H%M%S")}
SUMMARY:{topic} - AI-First Consulting
DESCRIPTION:Consultation with {appt['name']}. Topic: {topic}.
ATTENDEE;RSVP=TRUE:mailto:{appt['email']}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR"""
    return Response(content=ics.strip(), media_type="text/calendar", headers={"Content-Disposition": f'attachment; filename="consultation-{appointment_id[:8]}.ics"'})


# AI Chat
SYSTEM_PROMPT = """You are an AI consulting assistant for an AI-First Application Development consulting service.
You help potential clients understand our consulting services, answer questions about AI development,
and guide them toward booking a consultation.

Our services include:
- AI Strategy & Roadmap: Helping businesses identify AI opportunities and create implementation plans
- Custom AI Application Development: Building intelligent applications with NLP, Computer Vision, ML
- AI Integration: Integrating AI capabilities into existing systems and workflows
- Data Analytics & Visualization: Converting complex data into actionable insights
- AI-Assisted Development: Using AI to accelerate software development workflows
- Sports & Finance Analytics: Specialized AI solutions for sports and financial data

Be professional, helpful, and concise. If users want to book a consultation,
direct them to the consultation booking page. Respond in the same language the user writes in.
Keep responses focused and under 200 words unless more detail is explicitly requested."""


@app.post("/api/chat")
async def chat_with_ai(msg: ChatMessage):
    try:
        session_id = msg.session_id
        if session_id not in chat_sessions:
            chat = LlmChat(api_key=EMERGENT_LLM_KEY, session_id=session_id, system_message=SYSTEM_PROMPT)
            chat.with_model("openai", "gpt-4o-mini")
            chat_sessions[session_id] = chat
        chat = chat_sessions[session_id]
        response = await chat.send_message(UserMessage(text=msg.message))
        await chats_collection.insert_one({
            "session_id": session_id, "user_message": msg.message, "ai_response": response,
            "language": msg.language, "created_at": datetime.now(timezone.utc).isoformat(),
        })
        return {"session_id": session_id, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    messages = await chats_collection.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(100)
    return {"session_id": session_id, "messages": messages}


# Lead Magnet
@app.post("/api/leads")
async def capture_lead(form: LeadForm):
    lead_id = str(uuid.uuid4())
    existing = await leads_collection.find_one({"email": form.email}, {"_id": 0})
    if existing:
        return {"status": "success", "lead_id": existing.get("lead_id", lead_id), "message": "Welcome back!", "already_subscribed": True}
    await leads_collection.insert_one({
        "lead_id": lead_id, "name": form.name, "email": form.email, "company": form.company,
        "language": form.language, "source": "lead_magnet", "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await create_notification(
        "lead",
        f"New Lead: {form.name}",
        f"Email: {form.email}\nCompany: {form.company or 'N/A'}\nSource: Lead Magnet Download",
        {"lead_id": lead_id, "email": form.email},
    )
    return {"status": "success", "lead_id": lead_id, "message": "Thank you! Your guide is ready.", "already_subscribed": False}


@app.get("/api/leads/guide-pdf")
async def download_guide_pdf():
    pdf_bytes = generate_lead_magnet_pdf()
    return Response(
        content=bytes(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="5-Steps-AI-Integration-Guide.pdf"'},
    )


# Admin Dashboard
@app.post("/api/admin/login")
async def admin_login(login: AdminLogin):
    if login.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"status": "success", "token": hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()}


@app.get("/api/admin/stats")
async def admin_stats(x_admin_token: str = Header(None)):
    verify_admin(x_admin_token)
    total_contacts = await contacts_collection.count_documents({})
    total_appointments = await appointments_collection.count_documents({})
    total_leads = await leads_collection.count_documents({})
    total_chats = await chats_collection.count_documents({})
    confirmed_appts = await appointments_collection.count_documents({"status": "confirmed"})
    unread_notifs = await notifications_collection.count_documents({"read": False})

    recent_contacts = await contacts_collection.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    recent_appointments = await appointments_collection.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)
    recent_leads = await leads_collection.find({}, {"_id": 0}).sort("created_at", -1).to_list(10)

    return {
        "stats": {
            "total_contacts": total_contacts,
            "total_appointments": total_appointments,
            "confirmed_appointments": confirmed_appts,
            "total_leads": total_leads,
            "total_chat_messages": total_chats,
            "unread_notifications": unread_notifs,
        },
        "recent_contacts": recent_contacts,
        "recent_appointments": recent_appointments,
        "recent_leads": recent_leads,
    }


@app.get("/api/admin/notifications")
async def get_notifications(x_admin_token: str = Header(None)):
    verify_admin(x_admin_token)
    notifs = await notifications_collection.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return {"notifications": notifs}


@app.put("/api/admin/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, x_admin_token: str = Header(None)):
    verify_admin(x_admin_token)
    await notifications_collection.update_one({"notification_id": notification_id}, {"$set": {"read": True}})
    return {"status": "success"}


@app.put("/api/admin/notifications/read-all")
async def mark_all_notifications_read(x_admin_token: str = Header(None)):
    verify_admin(x_admin_token)
    await notifications_collection.update_many({"read": False}, {"$set": {"read": True}})
    return {"status": "success"}


@app.put("/api/admin/appointments/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status: str = Query(...), x_admin_token: str = Header(None)):
    verify_admin(x_admin_token)
    result = await appointments_collection.update_one({"appointment_id": appointment_id}, {"$set": {"status": status}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"status": "success", "appointment_id": appointment_id, "new_status": status}
