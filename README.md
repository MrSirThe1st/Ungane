STACK

Next.js
Supabase
Tailwind
shadcn/ui
WhatsApp API (360dialog)
Upstash Redis
Vercel
PostHog

Realtime Messaging Layer
Supabase gives you realtime, but you may enhance it with:
* WebSockets (built-in via Supabase)
* or lightweight event system


Authentication 
Use:
* Phone number login (important in Congo)
* OTP via WhatsApp or SMS
Optional:
* Twilio for SMS OTP

Payments (later stage)
For Congo/Africa:
Pawapay 
Later integrate:
* mobile money APIs


UNGANE COLOURS AND TYPOGRAPHY
Font humanist sans-serif.
￼
Color Palette Breakdown
* Deep Burgundy
    * HEX: #44242A
    * RGB: rgb(68, 36, 42)
    * Role: Dark background, high-contrast containers, or primary text in light mode.
* Terracotta / Crimson Red
    * HEX: #B84646
    * RGB: rgb(184, 70, 70)
    * Role: Secondary accents, active states, key data metrics, or medium-tier hierarchy elements.
* Coral Pink
    * HEX: #F47F80
    * RGB: rgb(244, 127, 128)
    * Role: Primary call-to-action (CTA) buttons, interactive highlights, or key focal points.
* Soft Peach Cream
    * HEX: #FEDCCB
    * RGB: rgb(254, 220, 203)
    * Role: Surface backgrounds, card fills, light mode canvas, or soft text contrast on dark backgrounds.
* Espresso Charcoal (Grid & Borders)
    * HEX: #1F1315
    * RGB: rgb(31, 19, 21)
    * Role: Structural borders, high-contrast grid lines, or deep shadow accent


60%
Soft Peach Cream
(backgrounds)

25%
Deep Burgundy
(navigation, branding, text)

10%
Terracotta
(status, secondary actions)

5%
Coral Pink
(main CTA)



UNGANE Product Vision Document
WhatsApp Business Growth Platform for Congo & Africa
(Name TBD)

1. Product Overview
Product Description
A WhatsApp-first customer engagement and automation platform that allows businesses to manage customer relationships, automate conversations, increase customer retention, collect feedback, and generate sales directly through WhatsApp.
The platform enables businesses of all sizes — from small shops to clinics, restaurants, spas, gyms, and service providers — to create automated customer journeys without needing technical knowledge.
Businesses connect their WhatsApp Business account to the platform, configure their workflows, and let the system automatically communicate with customers.

2. The Problem
Current situation in Congo
Many businesses already use WhatsApp every day, but mostly manually.
A typical business today:
* Saves customer numbers randomly
* Replies manually to every customer
* Loses customers after one purchase
* Has no customer history
* Cannot easily send targeted promotions
* Cannot automate reminders
* Cannot measure customer satisfaction
* Does not collect structured reviews
* Does not know which customers are inactive
WhatsApp is already the communication channel.
The missing piece is the intelligence layer on top of it.

3. The Solution
The platform transforms WhatsApp from a simple messaging tool into a complete customer relationship system.
Businesses can:
Acquire customers
* Convert visitors into WhatsApp contacts
* Capture customer information
* Build a customer database
Engage customers
* Answer automatically
* Guide customers through conversations
* Provide information instantly
Convert customers
* Book appointments
* Place orders
* Reserve tables
* Request services
Retain customers
* Send reminders
* Follow up
* Reactivate inactive customers
* Create loyalty programs
Understand customers
* Collect feedback
* Measure satisfaction
* Analyze customer behavior

4. Core Vision
“Every business should have a smart customer assistant on WhatsApp.”
The platform becomes:
* The CRM
* The marketing assistant
* The booking assistant
* The customer support assistant
* The retention engine
All inside WhatsApp.

5. Target Industries & Use Cases
The platform is horizontal: many industries can use it.

🧖 Beauty, Spa & Wellness
Problems:
* Missed appointments
* Customers forget to return
* No structured feedback
Solutions:
Booking
Customer:
Bonjour, je veux réserver
The assistant:
* Shows available services
* Shows available times
* Confirms appointment

Follow-ups
After appointment:
Bonjour Marie, merci pour votre visite. Comment était votre expérience ?

Reviews
Customer rates:
⭐⭐⭐⭐⭐
System:
Merci ! Voulez-vous partager votre experience sur Google ?

Reactivation
After 45 days:
Bonjour Marie, cela fait longtemps que nous ne vous avons pas vue. Nous avons une nouvelle offre.

🍽 Restaurants
Use cases:
Reservations
Customer:
Réserver une table
Flow:
* Number of people
* Date
* Time
* Confirmation

Promotions
Examples:
* New menu
* Weekend offers
* Events

Loyalty
System tracks visits:
Vous êtes à votre 9ème visite. Votre prochaine boisson est offerte.

Feedback
After meal:
Comment était votre expérience ?

🛍 Retail Shops
Examples:
* Clothing stores
* Electronics
* Cosmetics
* Supermarkets
Use cases:
Customer database
Store:
* Name
* Purchases
* Preferences

New arrivals
Example:
Bonjour Sarah, notre nouvelle collection vient d'arriver.

Customer reactivation
Example:
Nous avons pensé à vous. Voici nos nouveaux produits.

Product catalogue
Customer:
Montrez-moi vos produits
Receives:
* Images
* Prices
* Availability

🏥 Clinics & Medical Centers
Use cases:
Appointment management
* Booking
* Confirmation
* Cancellation

Reminders
Example:
Votre rendez-vous est demain à 10h.

Medication reminders
Example:
Bonjour Jean, rappel: votre traitement est prévu maintenant.
(Must be designed carefully according to healthcare privacy requirements.)

Patient follow-up
After consultation:
Comment vous sentez-vous depuis votre visite ?

🏋️ Gyms & Fitness Centers
Use cases:
Membership management
* Registration
* Renewals

Class booking
Customer:
réserver cours
Flow:
* Choose class
* Choose time
* Confirm

Training programs
Send:
* Workout plans
* Reminders
* Motivation messages

Retention
Detect inactive members:
Nous ne vous avons pas vu depuis 3 semaines.

Other Possible Industries
Hotels
* Reservations
* Check-in information
* Customer feedback
Schools
* Parent communication
* Payment reminders
* Announcements
Real Estate
* Property inquiries
* Visit scheduling
Car dealerships
* Test drives
* Maintenance reminders
Banks / Financial services
* Notifications
* Customer support
Delivery businesses
* Order tracking
* Notifications

6. Core Product Modules
Module 1 — Customer CRM
Every business gets:
Customer profiles:
* Name
* Phone
* Tags
* History
* Interactions
* Purchases
* Appointments

Module 2 — Flow Builder
The heart of the platform.
Businesses create automated journeys.
Example:

Customer arrives
        ↓
Collect phone number
        ↓
Ask preference
        ↓
Save information
        ↓
Trigger future messages


Businesses can use:
Templates:
* Booking flow
* Feedback flow
* Promotion flow
* Reminder flow
* Loyalty flow

Module 3 — WhatsApp Automation Engine
Handles:
* Incoming messages
* Responses
* Conditions
* Scheduling
* Actions
Example:

IF customer hasn't visited in 60 days

THEN

send reactivation message


Module 4 — Marketing Campaigns
Businesses can:
* Segment customers
* Create campaigns
* Send approved WhatsApp templates
Examples:
Segments:
* New customers
* VIP customers
* Inactive customers

Module 5 — Reviews & Reputation
Collect:
* Ratings
* Feedback
Generate:
* Google reviews
* Social proof

Module 6 — Analytics
Business sees:
* Number of customers
* Conversations
* Bookings
* Campaign results
* Customer satisfaction

7. Technology Architecture
Phase 1
WhatsApp:
360dialog
Used for:
* WhatsApp API access
* Messages
* Templates
* Webhooks
* Flows

Your platform:
Frontend:
* Business dashboard
Backend:
* Customer database
* Automation engine
* Workflow system
Database:
* Businesses
* Customers
* Conversations
* Flows
* Campaigns

Phase 2 (Scale)
Move toward direct:
WhatsApp Business Platform
Advantages:
* More control
* Better economics
* Direct relationship with Meta

8. Competitive Advantage
Existing solutions:
Many are:
* Too complex
* Designed for Europe/US markets
* Expensive
* Not adapted locally

Your advantage:
🇨🇩 Built for Congo
* French-first
* Simple interface
* Local payment options
* Local business understanding
* Affordable pricing

9. Monetization
Subscription model
Starter
For small businesses:
Example:
* Customer database
* Basic automation
* Limited messages

Professional
For growing businesses:
* Advanced flows
* Campaigns
* Analytics
* Multiple employees

Enterprise
For:
* Hospitals
* Hotels
* Chains
Features:
* Multiple branches
* Custom integrations

Additional revenue
Message usage
Businesses pay for WhatsApp usage.

Premium templates
Industry-specific automation packs.
Example:
“Spa Growth Package”
Includes:
* Booking
* Review collection
* Reactivation

Setup services
For larger businesses:
* Flow creation
* Integration
* Training

10. Long-Term Vision
The platform becomes the operating system for customer relationships in African businesses.
Starting with WhatsApp.
Eventually expanding into:
* SMS
* Instagram messaging
* Facebook Messenger
* Email
* Voice assistants

11. The Core Statement
Product Mission
“Help every business in Congo and Africa turn WhatsApp conversations into customers, loyalty, and growth.”

12. MVP Recommendation
Do not start with every industry.
First version:
Target: Beauty/spa + restaurants
Why:
* Easy to understand
* High customer frequency
* Clear ROI
Build:
1. Customer database
2. WhatsApp connection
3. Flow builder (basic)
4. Booking flow
5. Feedback/review flow
6. Campaign messaging
Then expand.



UNGANE Product Requirements Document (PRD)
Product Name
(Working Name TBD) WhatsApp Customer Engagement & Automation Platform
Version: 1.0 Status: Product Definition Target Market: Democratic Republic of Congo (initially), Africa (future)

1. Product Summary
1.1 Overview
The product is a WhatsApp-first customer relationship management and automation platform that enables businesses to acquire, manage, engage, and retain customers through automated WhatsApp conversations.
The platform allows businesses to create customer journeys such as:
* Booking appointments
* Sending reminders
* Collecting feedback
* Generating reviews
* Running marketing campaigns
* Managing customer loyalty
* Re-engaging inactive customers
without requiring technical knowledge.

2. Product Vision
Vision Statement
Become the easiest way for African businesses to transform WhatsApp conversations into customer relationships, sales, and loyalty.

3. Problem Statement
Current Business Reality
Businesses in Congo already rely heavily on WhatsApp, but their usage is mostly manual.
Common problems:
Customer management problems
* Customer information is lost in chats
* No organized customer database
* No customer history
* No segmentation
Sales problems
* Missed opportunities
* Slow responses
* No automated conversion process
Retention problems
* Customers disappear after one purchase
* No reminders
* No loyalty system
Marketing problems
* No structured campaigns
* No customer targeting
* No measurement of results

4. Product Goals
Primary Goals
The platform should allow businesses to:
Goal 1 — Build customer databases
Capture and organize customer information automatically.
Goal 2 — Automate conversations
Reduce manual communication through workflows.
Goal 3 — Increase customer retention
Bring customers back through reminders and personalized communication.
Goal 4 — Increase conversions
Turn conversations into:
* appointments
* purchases
* reservations
* visits
Goal 5 — Improve customer experience
Provide faster and more consistent communication.

5. Non-Goals (Initial Version)
The platform will NOT initially:
❌ Replace WhatsApp ❌ Become a payment platform ❌ Become a full ERP system ❌ Replace business websites ❌ Build complex AI assistants immediately ❌ Support every industry-specific workflow from day one

6. Target Users

User Type 1: Business Owner
Examples:
* Spa owner
* Restaurant owner
* Shop owner
* Gym owner
Needs:
* More customers
* More repeat customers
* Less manual work

User Type 2: Business Employee
Examples:
* Receptionist
* Sales assistant
* Customer service employee
Needs:
* Access customer information
* Manage conversations
* Handle bookings

User Type 3: Customer
The end customer interacting through WhatsApp.
Needs:
* Quick answers
* Easy booking
* Simple communication

7. Supported Industries
Initial industries:
Beauty & Wellness
* Spas
* Salons
* Beauty centers
Food & Hospitality
* Restaurants
* Cafes
* Hotels
Retail
* Fashion stores
* Electronics
* Cosmetics
Health
* Clinics
* Medical centers
Fitness
* Gyms
* Training centers
Future:
* Schools
* Real estate
* Automotive
* Financial services
* Delivery companies

8. Core Product Modules

Module 1 — Business Account Management
Description
Allows businesses to create an account and connect their WhatsApp Business identity.

Features
Business registration
Business provides:
* Business name
* Industry
* Location
* Contact information
* Owner information

WhatsApp connection
The business connects:
* WhatsApp Business number
* WhatsApp Business Platform account
Integration:
Phase 1:
* 360dialog
Future:
* Direct WhatsApp Business Platform integration

Module 2 — Customer CRM
Description
Central customer database.

Customer Profile
Stores:
* Name
* Phone number
* Email (optional)
* Tags
* Preferences
* Visit history
* Purchase history
* Conversation history
* Appointments
* Feedback

Customer Segmentation
Businesses can create groups:
Examples:
* New customers
* VIP customers
* Inactive customers
* Customers interested in cosmetics

Module 3 — Conversation Engine
Description
The system that manages WhatsApp interactions.

Responsibilities
Receive:
* Customer messages
* Button responses
* Flow submissions
Process:
* Identify customer
* Identify business
* Trigger workflow
Send:
* Messages
* Templates
* Interactive content

Module 4 — Flow Builder
Description
Allows businesses to create automated customer journeys.

MVP Flow Builder
Businesses do NOT create complex technical workflows.
They use templates.

Example:
Appointment Booking Flow

Customer starts conversation

↓

Select service

↓

Choose available date

↓

Confirm booking

↓

Save appointment

↓

Send reminder


Available Flow Templates
Booking Flow
For:
* spas
* clinics
* restaurants
* gyms

Feedback Flow
After interaction:

Rate experience

↓

If positive:
Ask for Google review

↓

If negative:
Notify business


Reminder Flow
Examples:
* Appointment reminder
* Membership renewal
* Medication reminder

Reactivation Flow
Example:

Customer inactive for 60 days

↓

Send WhatsApp template

↓

Offer promotion


Module 5 — Marketing Campaigns
Description
Allows businesses to send targeted WhatsApp communications.

Features
Create campaigns:
Examples:
* New product launch
* Discount
* Event announcement

Requirements
Must respect WhatsApp policies:
* Customer opt-in required
* Templates required outside the 24-hour conversation window

Module 6 — Reviews & Reputation Management
Description
Generate customer feedback and online reputation.

Flow
Customer completes service:
↓
Receives WhatsApp message:
"How was your experience?"
↓
Rating:
1-5 stars
↓
If positive:
Send Google review link
↓
If negative:
Collect private feedback

Module 7 — Booking Management
Description
Businesses manage appointments.

Features:
* Create booking
* Confirm booking
* Cancel booking
* Send reminders
* View calendar

Module 8 — Analytics Dashboard
Description
Give businesses visibility.

Metrics:
Customers
* Total customers
* New customers
* Returning customers
Conversations
* Messages sent
* Messages received
* Response rate
Business outcomes
* Bookings
* Reviews
* Campaign results

9. MVP Scope
The first version should focus on proving value.

MVP Features
Business side
✅ Account creation ✅ WhatsApp connection ✅ Customer database ✅ Basic dashboard ✅ Customer segmentation

WhatsApp side
✅ Receive messages ✅ Send messages ✅ Interactive buttons ✅ Templates ✅ Webhooks

Automation
✅ Booking flow ✅ Feedback flow ✅ Reminder flow

Analytics
✅ Basic customer metrics

10. User Stories

Business Owner
Create account
As a business owner, I want to create my account so I can start managing customers.

Connect WhatsApp
As a business owner, I want to connect my WhatsApp number so my customers can communicate with my business.

Activate automation
As a business owner, I want to activate a booking flow so customers can schedule appointments automatically.

Customer
Book appointment
As a customer, I want to book through WhatsApp without calling the business.

Give feedback
As a customer, I want to rate my experience after a service.

11. Technical Architecture

Frontend
Business dashboard:
* Web application
* Responsive design

Backend
Responsibilities:
* Authentication
* Businesses
* Customers
* Workflows
* Messaging
* Analytics

Database
Core entities:

Business

User

Customer

Conversation

Message

Flow

FlowStep

Campaign

Template

Appointment

Review

Event


Messaging Layer
Important architecture:

Application

↓

Messaging Service

↓

360dialog

↓

WhatsApp

Future:

Messaging Service

↓

Meta Direct API


12. Monetization
Subscription Plans

Starter
For small businesses.
Includes:
* Customer database
* Basic flows
* Limited campaigns

Professional
For growing businesses.
Includes:
* Advanced automation
* Analytics
* Multiple users
* Segmentation

Enterprise
For:
* Clinics
* Hotels
* Chains
Includes:
* Multiple branches
* Custom integrations
* Dedicated support

Additional Revenue
WhatsApp usage fees
Businesses pay messaging usage.
Setup services
Professional onboarding.
Industry packages
Examples:
* Spa Growth Package
* Restaurant Package
* Clinic Package

13. Competitive Advantages
Local Advantage
Built for Congo:
* French-first
* Simple UX
* Affordable
* Local business workflows

Product Advantage
Compared with generic tools:
* Ready-made flows
* Industry templates
* WhatsApp-first
* No technical knowledge required

14. Success Metrics
Product Metrics
Number of:
* Businesses registered
* Connected WhatsApp numbers
* Active customers
* Messages sent
* Automated conversations

Business Impact Metrics
Measure:
* Increase in bookings
* Increase in repeat customers
* Reviews generated
* Customer retention

15. Long-Term Roadmap
Phase 1
WhatsApp CRM + Automation
Phase 2
Advanced Flow Builder
Phase 3
AI Customer Assistant
Phase 4
Multi-channel:
* WhatsApp
* Instagram
* SMS
* Email

Product North Star Metric
Number of successful customer interactions automated through the platform.


UNGANE System Design Document (SDD)
WhatsApp Customer Engagement & Automation Platform
Version: 1.0 Status: Technical Architecture Definition Purpose: Define the technical foundation for a multi-tenant SaaS platform that enables businesses to manage customers, automate WhatsApp conversations, and create customer engagement workflows.

1. System Overview
1.1 Purpose
The platform is a multi-tenant SaaS application where multiple businesses can connect their WhatsApp Business accounts and use the platform to:
* Manage customer relationships
* Automate WhatsApp conversations
* Create workflows
* Schedule reminders
* Collect reviews
* Run campaigns
* Analyze customer interactions
The platform acts as the intelligence layer between businesses and WhatsApp.

2. High-Level Architecture
2.1 Architecture Overview

                         Customers
                             |
                             |
                       WhatsApp App
                             |
                             |
              WhatsApp Business Platform API
                             |
                             |
                         360dialog
                             |
                             |
                    Messaging Gateway Layer
                             |
        ------------------------------------------------
        |                     |                        |
   Flow Engine          Customer CRM              Campaign Engine
        |                     |                        |
        ------------------------------------------------
                             |
                        Backend API
                             |
        ------------------------------------------------
        |                     |                        |
    Database             File Storage             Queue System


3. Core Architectural Principles
Principle 1 — Provider Independence
The platform must not depend directly on 360dialog.
Architecture:

Application

↓

Messaging Interface

↓

360dialog

↓

WhatsApp

Later:

Application

↓

Messaging Interface

↓

Meta Cloud API

↓

WhatsApp


Principle 2 — Multi-Tenant by Design
The platform supports thousands of businesses.
Example:

Platform

 ├── Spa Lumière
 │      ├── Customers
 │      ├── Flows
 │      └── Messages
 │
 ├── Restaurant ABC
 │      ├── Customers
 │      ├── Flows
 │      └── Messages
 │
 └── Gym FitZone
        ├── Customers
        ├── Flows
        └── Messages

Every piece of business data belongs to a tenant.

4. User Roles
Platform Roles

Super Admin
Internal platform team.
Permissions:
* Manage businesses
* View platform analytics
* Manage subscriptions
* Handle support

Business Owner
The customer paying for the platform.
Permissions:
* Manage business settings
* Manage employees
* Configure workflows
* View analytics

Business Staff
Examples:
* Receptionist
* Sales assistant
Permissions:
* View customers
* Handle conversations
* Manage appointments

5. Database Design
Database recommendation:
* PostgreSQL

5.1 Core Entities
Business
Represents a company using the platform.

Business

id
name
industry
country
city
phone
email

whatsapp_account_id
status

created_at
updated_at

Example:

Spa Lumière
Industry: Wellness
Country: DRC


User
Platform users.

User

id

business_id

name
email
phone

role

password_hash

created_at
updated_at

Relationship:

Business
   |
   |
Users


Customer
The end customers communicating through WhatsApp.

Customer

id

business_id

phone_number

first_name
last_name

email

tags

last_interaction_at

created_at
updated_at

Important:
A customer belongs to a business.
Example:

Spa Lumière

Customer:
Marie
+243...


Conversation
Stores WhatsApp conversations.

Conversation

id

business_id

customer_id

status

started_at

last_message_at


Message
Stores every WhatsApp message.

Message

id

conversation_id

direction

type

content

whatsapp_message_id

status

created_at

Direction:

INBOUND
OUTBOUND

Status:

SENT
DELIVERED
READ
FAILED


Appointment
For spas, clinics, gyms, restaurants.

Appointment

id

business_id

customer_id

service

date

time

status

created_at


Review
Customer feedback.

Review

id

business_id

customer_id

rating

comment

google_review_sent

created_at


Campaign
Marketing campaigns.

Campaign

id

business_id

name

type

status

scheduled_at

created_at


Template
WhatsApp approved templates.

Template

id

business_id

name

category

language

status

content

Categories:

UTILITY
MARKETING
AUTHENTICATION


6. Flow Engine Design
This is the heart of the platform.
The goal:
Allow businesses to create automated customer journeys.

6.1 Flow Concept
A flow is:
A sequence of steps triggered by an event.
Example:

Customer finishes appointment

↓

Wait 2 hours

↓

Send feedback message

↓

Customer rates 5 stars

↓

Send Google review link


6.2 Flow Database
Flow

Flow

id

business_id

name

trigger_type

status

created_at


Example:

Name:
Post Appointment Feedback

Trigger:
Appointment Completed


Flow Step

FlowStep

id

flow_id

type

configuration

position


Step types:

MESSAGE

QUESTION

BUTTON

CONDITION

WAIT

ACTION

END


Example:

Flow

Step 1
MESSAGE
"How was your experience?"

↓

Step 2
BUTTON
1-5 stars

↓

Step 3
CONDITION

IF rating >=4

↓

Step 4
SEND REVIEW LINK


7. Flow Execution Engine
The engine executes workflows.

Example:
Customer:

Appointment completed

Event created:

appointment.completed

Flow engine checks:

Which flows listen to this event?

Finds:

Feedback Flow

Executes:

Send WhatsApp message


Event System
Important events:

customer.created

customer.message_received

appointment.created

appointment.completed

customer.inactive

campaign.started


8. WhatsApp Integration Architecture

8.1 Messaging Layer
Never call 360dialog directly.
Create:

MessagingService

Interface:

sendMessage()

sendTemplate()

sendInteractiveMessage()

sendFlow()

handleWebhook()


Implementation:

MessagingService

       |
       |

360DialogProvider

Future:

MetaProvider


8.2 Incoming Message Flow
Customer:

Bonjour

↓
WhatsApp
↓
360dialog webhook
↓
Your API
↓
Identify:
* Business
* Customer
* Conversation
↓
Flow Engine decides response
↓
Send reply

8.3 Outgoing Message Flow
System event:

Appointment tomorrow

↓
Flow Engine
↓
Messaging Service
↓
360dialog
↓
WhatsApp
↓
Customer

9. Multi-Tenant Architecture
This is critical.

Tenant Isolation
Every table contains:

business_id

Example:
Customer table:

id
business_id
name
phone


Spa:

business_id = 001

Restaurant:

business_id = 002

A spa can never see restaurant customers.

10. WhatsApp Account Management
Each business has its own WhatsApp identity.
Database:
WhatsAppAccount

WhatsAppAccount

id

business_id

phone_number

provider

provider_account_id

status


Example:

Spa Lumière

WhatsApp:
+243 8xx xxx xxx

Provider:
360dialog


11. Notifications & Background Jobs
Some tasks cannot run immediately.
Examples:
* Send reminder tomorrow
* Reactivate customer after 60 days
* Process campaigns
Need:
Queue system.
Example:

Appointment Reminder Job

Scheduled:
Tomorrow 08:00

↓

Send WhatsApp template


12. Security
Requirements:
Authentication
* Secure login
* MFA later

Authorization
Business users can only access their tenant.

Data protection
Protect:
* Phone numbers
* Customer history
* Medical information (for clinics)

13. Analytics Architecture
Track events:

message.sent

message.read

booking.created

review.completed

campaign.opened


Analytics examples:
Business dashboard:

Customers:
2,450

Bookings:
320 this month

Reviews:
85

Average rating:
4.7


14. MVP Technical Scope
First build:
Backend
✅ Authentication ✅ Businesses ✅ Customers ✅ Conversations ✅ Messages ✅ WhatsApp integration ✅ Basic flows ✅ Templates ✅ Appointments

Frontend
Business dashboard:
Pages:

Dashboard

Customers

Conversations

Flows

Appointments

Campaigns

Settings


15. Future Expansion
AI Assistant
Later:
* Understand customer intent
* Recommend products
* Answer FAQs

Additional channels
Architecture should allow:

Messaging Layer

 ├── WhatsApp

 ├── Instagram

 ├── SMS

 └── Email


16. Final Architecture Vision
The platform becomes:

                  Business Users
                       |
                       |
                 Your Dashboard
                       |
                       |
                 Business Logic
                       |
 ------------------------------------------------
 |                 |              |              |
 CRM          Flow Engine    Campaigns     Analytics
 |
 |
 Messaging Layer
 |
 ------------------------------------------------
 |
 WhatsApp / Instagram / SMS / Email


Core Technical Principle
WhatsApp is only the communication channel.
The real product is:
A customer relationship and automation engine that allows any business to create intelligent customer journeys.



UNGANE MVP Development Roadmap
Product: WhatsApp Business Growth Platform
Goal of MVP
Validate one simple hypothesis:
Businesses are willing to pay for a system that helps them collect customers, automate WhatsApp conversations, and bring customers back.

Phase 0 — Product Foundation (Before coding)
Duration: 1-2 weeks
Decisions
Target first customers:
I would NOT start with every industry.
Choose businesses with:
* frequent customers
* repeat purchases
* clear ROI
Best first candidates:
Option 1: Spa / Beauty center ⭐⭐⭐⭐⭐
Why:
* Customers return frequently
* Booking is important
* Reviews matter
* Owner understands value quickly

Option 2: Restaurant ⭐⭐⭐⭐
Why:
* Reservations
* Promotions
* Loyalty

Option 3: Supermarket ⭐⭐⭐
Interesting but harder:
Pros:
* Many customers
Cons:
* Less personal relationship
* Promotions are price-focused

My recommendation:
Start with:
1. Spa
2. Restaurant
3. One retail business
Not because the platform only works there, but because they prove different use cases.

Phase 1 — First 30 Days
Objective:
Build the foundation.

Features to build
1. Business Account
Businesses can:
* Register
* Create profile
* Add employees
Database:

Business
User
Role


2. WhatsApp Connection
Integration:
360dialog
Capabilities:
* Connect WhatsApp number
* Receive messages
* Send messages
* Receive webhooks

Database:

WhatsAppAccount
Message
Conversation


3. Customer CRM
Basic version:
Business can see:
* Customer name
* Phone number
* Last interaction
* Conversation history
Database:

Customer
Conversation
Message


4. Basic Dashboard
Screens:

Dashboard

Customers

Conversations

Settings


First working demo:
A spa owner can:
1. Register
2. Connect WhatsApp
3. Customer sends "Bonjour"
4. Business receives it
5. Customer is saved automatically

Phase 2 — Days 30-60
Objective:
Create the first automation value.

Build Flow Engine v1
Do NOT build a complicated drag-and-drop builder yet.
That is a trap.
Instead:
Build:
Flow Templates
Example:
Feedback Flow

Appointment completed

↓

Send:
"How was your experience?"

↓

Customer chooses:

⭐
⭐⭐
⭐⭐⭐
⭐⭐⭐⭐
⭐⭐⭐⭐⭐

↓

Store result


Database:

Flow
FlowStep
FlowExecution


Build Appointment Module
For:
* Spa
* Clinic
* Gym
Features:
Business:
* Create services
* Define availability
Customer:
* Book through WhatsApp
Database:

Service
Appointment
Availability


Build Review System
Flow:

Customer rates 5 stars

↓

Send Google Review link

Database:

Review


Phase 3 — Days 60-90
Objective:
Build retention and monetization.

Marketing Campaigns
Businesses can:
Create:
"New product launch"
Target:
* All customers
* VIP customers
* Inactive customers

Need:

Campaign
CampaignRecipient
Template


Customer Segmentation
Examples:

VIP

New customer

Inactive

Frequent buyer


Database:

CustomerTag
Tag


Add Analytics
Dashboard:
Business sees:

Customers:
1,250

New this month:
180

Bookings:
240

Reviews:
75

Average rating:
4.6


Meta Verification Feature
This should come after the basic platform works.
Why?
Because verification is not your core value.
It is a trust accelerator.

Feature: Business Verification Service
Goal:
Help businesses become more trustworthy on WhatsApp.

User flow:
Business clicks:
"Verify my business"
↓
Your platform collects:

Company information
* Legal business name
* Registration documents
* Tax information
* Address
* Website/social links
* Industry
* Contact persons

Identity verification
Owner:
* ID document
* Selfie verification (if needed)
* Business ownership proof

Business profile optimization
Your system checks:
✅ Logo ✅ Description ✅ Website ✅ Address ✅ Category ✅ Hours

Submission
Your platform guides them through Meta verification requirements.

Your advantage
Most businesses fail because they submit incomplete information.
You provide:
"Meta Verification Assistant"

Monetization of verification
This can be premium.
Example:
Basic plan
Customer management

Verification package
One-time fee:
* Document preparation
* Profile optimization
* Submission assistance

Important:
The result could be:
Best case:
Meta approves official business status.
If not:
They still get:
* Verified profile on your platform
* Trust badge inside your ecosystem
* Professional WhatsApp setup

Features NOT to build initially
Avoid these:
❌ AI chatbot
Why?
Everyone wants AI, but your problem is not intelligence.
Your problem is:
* customer capture
* automation
* retention

❌ Full drag-and-drop flow builder
Too early.
Start with templates.

❌ Multi-channel messaging
No Instagram/SMS/email initially.
Focus WhatsApp.

❌ Payment integration
Not needed for first proof.

❌ Complex CRM features
Don't build Salesforce.

First Database Tables
MVP:
Identity

User
Business
Role


WhatsApp

WhatsAppAccount
Conversation
Message
Template


CRM

Customer
CustomerTag
Tag


Automation

Flow
FlowStep
FlowExecution


Business operations

Service
Appointment
Review
Campaign


First APIs
Authentication

POST /auth/register
POST /auth/login


Business

POST /business
GET /business/profile
PATCH /business/profile


Customers

GET /customers

GET /customers/:id

POST /customers


WhatsApp

POST /webhooks/whatsapp

POST /messages/send

POST /templates/send


Flows

GET /flows

POST /flows

POST /flows/:id/activate


Appointments

POST /appointments

GET /appointments


First Pilot Program
Pilot 1: Spa
Example:
"Beauty House Kolwezi"
Setup:
Day 1:
* Connect WhatsApp
* Import existing customers
Day 2:
Activate:
* Booking flow
* Reminder flow
* Review flow

Measure:
Before:
* 20 bookings/week
After:
* 30 bookings/week

Pilot 2: Restaurant
Activate:
* Reservation flow
* Loyalty
* Promotions
Measure:
* Repeat customers
* Reservations

Pilot 3: Supermarket
Activate:
* Customer database
* Promotions
* New arrivals
Measure:
* Campaign conversion

Final MVP Definition
After 90 days you should have:
✅ Multi-business platform ✅ WhatsApp integration ✅ Customer CRM ✅ Automated flows ✅ Booking system ✅ Reviews ✅ Basic campaigns ✅ Analytics ✅ First paying businesses

Strategic Positioning
You are NOT selling:
"WhatsApp automation"
That sounds like a tool.
You are selling:
"A digital customer assistant that helps African businesses attract, understand, and retain customers through WhatsApp."
