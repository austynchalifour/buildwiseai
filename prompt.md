# Product Requirements Document (PRD)

## Product Name

BuildWise AI

## Vision

Enable homeowners, DIYers, and property investors to turn a rough sketch, photo, or idea into a complete build plan, material list, cost estimate, and contractor-ready project package within minutes.

---

# Problem

Millions of people want to build projects such as:

* Decks
* Fences
* Pergolas
* Sheds
* Garages
* Basement renovations
* Outdoor kitchens

However, most users struggle with:

* Knowing what materials are required
* Estimating project costs
* Understanding construction steps
* Determining project difficulty
* Finding qualified contractors

Current solutions require multiple tools, manual research, and significant construction knowledge.

---

# Goal

Allow a user to upload a sketch or describe a project and receive:

1. Project analysis
2. Material requirements
3. Cost estimate
4. Step-by-step instructions
5. Construction visualization
6. Contractor hiring options

All within one workflow.

---

# Target Users

### Primary

Homeowners

* DIY enthusiasts
* First-time homeowners
* Property investors
* Real estate flippers

### Secondary

Contractors

* General contractors
* Deck builders
* Fence installers
* Remodelers

### Future

Commercial construction companies

---

# User Flow

## Flow 1: DIY Planning

### Step 1

User uploads:

* Hand-drawn sketch
* Inspiration image
* Blueprint
* Written description

Example:

"I want a 12x16 deck attached to my house."

### Step 2

AI analyzes:

* Structure type
* Dimensions
* Materials
* Complexity

### Step 3

AI generates:

#### Project Summary

* Deck
* 12x16
* Pressure-treated lumber

#### Estimated Cost

* Materials
* Labor
* Permits (if applicable)

#### Shopping List

* Lumber
* Fasteners
* Hardware
* Concrete

#### Product Mapping

Match products directly from:

* Home Depot
* Lowe's

#### Build Instructions

Detailed step-by-step guide

#### Difficulty Score

* Beginner
* Intermediate
* Advanced

#### Time Estimate

* Weekend
* 1 week
* 2+ weeks

---

## Flow 2: Hire a Contractor

### Step 1

User completes project plan.

### Step 2

User clicks:

"Get Contractor Quotes"

### Step 3

System packages:

* Sketch
* Materials
* Scope
* Dimensions

### Step 4

Project is sent to contractors.

### Step 5

Contractors submit bids.

### Step 6

User compares:

* Price
* Reviews
* Timeline

### Step 7

User hires contractor.

---

# Core Features

## Feature 1

### AI Sketch Recognition

Input:

* Hand sketch
* Drawing
* Blueprint
* Screenshot

Output:

* Structured project data

---

## Feature 2

### Material Calculator

Generate:

* Exact material quantities
* Waste factor
* Recommended products

---

## Feature 3

### Retail Catalog Integration

Integrate with:

* Home Depot
* Lowe's

Capabilities:

* Product lookup
* Pricing
* Inventory status
* Product substitutions

---

## Feature 4

### Cost Estimation Engine

Estimate:

* Material costs
* Labor costs
* Permit costs
* Regional pricing adjustments

---

## Feature 5

### AI Construction Planner

Generate:

* Project phases
* Tool requirements
* Safety considerations
* Build instructions

---

## Feature 6

### Project Visualization

Generate:

* 2D plans
* 3D renders
* Before/after previews

---

## Feature 7

### Contractor Marketplace

Contractors can:

* Receive leads
* Submit bids
* Showcase portfolio
* Manage projects

---

# MVP Scope

## Included

### User uploads sketch

### AI identifies project

### AI estimates dimensions

### Material list generation

### Cost estimation

### Product matching

### Step-by-step instructions

### PDF export

---

## Excluded

### Contractor marketplace

### Payments

### Permit automation

### Commercial projects

### Mobile app

---

# Technical Requirements

## Frontend

* Next.js
* TailwindCSS
* TypeScript

---

## Backend

* Node.js
* PostgreSQL

---

## AI Stack

### Vision Model

Analyze:

* Sketches
* Drawings
* Images

### LLM

Generate:

* Instructions
* Material lists
* Project plans

---

## Integrations

### Retailers

* Home Depot Catalog
* Lowe's Catalog

### Mapping

* Google Maps

### Storage

* S3-compatible object storage

---

# Revenue Model

## Free Tier

3 projects per month

Includes:

* Cost estimate
* Basic material list

---

## Pro

$19/month

Includes:

* Unlimited projects
* Advanced plans
* PDF exports
* 3D renderings

---

## Contractor Leads

Charge contractors:

$25–$100 per lead

---

## Affiliate Revenue

Commission from material purchases.

---

# Success Metrics

## User Metrics

* Monthly active users
* Project completion rate
* Repeat usage

## Business Metrics

* Paid conversion rate
* Revenue per user
* Lead conversion rate

## Product Metrics

* Material estimate accuracy
* Cost estimate accuracy
* Time to generate project

---

# Future Roadmap

## Phase 2

* Contractor bidding marketplace
* Permit requirement detection
* Permit application assistance

## Phase 3

* AR project visualization
* Mobile app
* Voice-guided build assistant

## Phase 4

* Full residential renovation planning
* Commercial construction support
* AI project manager

---

# MVP One-Sentence Pitch

"Upload a sketch of what you want to build and instantly receive a complete material list, cost estimate, shopping cart, and step-by-step construction plan."
