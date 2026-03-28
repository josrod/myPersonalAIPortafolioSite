import os
import uuid
import asyncio
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.llm.chat import LlmChat, UserMessage

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

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
contacts_collection = db["contacts"]
appointments_collection = db["appointments"]
chats_collection = db["chats"]

# Active chat sessions
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

class ChatResponse(BaseModel):
    session_id: str
    response: str

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
        "date": form.date,
        "time": form.time,
        "status": {"$ne": "cancelled"}
    }, {"_id": 0})
    
    if existing:
        raise HTTPException(status_code=409, detail="This time slot is already booked. Please select another time.")
    
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
    return {
        "status": "success",
        "appointment_id": appointment_id,
        "message": "Appointment booked successfully!",
        "appointment": {
            "date": form.date,
            "time": form.time,
            "topic": form.topic,
        }
    }


@app.get("/api/appointments/available")
async def get_available_slots(date: str):
    booked = await appointments_collection.find(
        {"date": date, "status": {"$ne": "cancelled"}},
        {"_id": 0, "time": 1}
    ).to_list(100)
    booked_times = [b["time"] for b in booked]
    
    all_slots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00"
    ]
    available = [s for s in all_slots if s not in booked_times]
    return {"date": date, "available_slots": available, "booked_slots": booked_times}


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
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=session_id,
                system_message=SYSTEM_PROMPT,
            )
            chat.with_model("openai", "gpt-4o-mini")
            chat_sessions[session_id] = chat
        
        chat = chat_sessions[session_id]
        user_message = UserMessage(text=msg.message)
        response = await chat.send_message(user_message)
        
        chat_doc = {
            "session_id": session_id,
            "user_message": msg.message,
            "ai_response": response,
            "language": msg.language,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await chats_collection.insert_one(chat_doc)
        
        return {"session_id": session_id, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    messages = await chats_collection.find(
        {"session_id": session_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    return {"session_id": session_id, "messages": messages}
