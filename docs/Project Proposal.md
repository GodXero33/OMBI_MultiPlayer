**PR24113101**  
**Sathish Shan**  
**Individual Project**  

# Project Proposal: OmbiArenaLK

## 1. Introduction

### 1.1 Project Overview
OmbiArenaLK is a web-based platform designed for Sri Lankan players, particularly elders, to enjoy traditional card games online. The initial release will feature the game **OMBI**, with a scalable structure allowing additional card games to be integrated in the future.

### 1.2 Objectives
- Provide an **accessible and engaging** online platform for Sri Lankan traditional card games.
- Offer **real-time multiplayer** experiences with a waiting mechanism until enough players join.
- Ensure a **simple and intuitive** user interface suitable for elders.
- Implement **self-hosted servers** to maintain control over game hosting and availability.
- Future-proof the platform with features like **AI bots, friend matches, spectator mode, and tournament management**.

### 1.3 Target Audience
- **Primary users:** Sri Lankan card game enthusiasts, especially elders who enjoy traditional card games.
- **Casual users:** Younger players interested in exploring cultural games online.

## 2. Features & Scope

### 2.1 Core Features (MVP)
- **Game Modes:** 
  - **Multiplayer** with real-time WebSocket-based gameplay.
  - **Players wait in a lobby** until enough players join to start a match.
  - **AI bots planned for future updates** to fill in for missing players.
- **Multiple rule sets** for OMBI to match different regional variations.
- **User Interface:** 
  - Simple, easy-to-navigate UI tailored for elder users.
  - **Game table design** mimicking real-life card tables.
  - **Smooth animations** for card movements.
- **Data Management:**
  - **No account required** for casual play.
  - **Optional accounts** for leaderboard tracking & game history.
  - Match records stored in a **secure database**.
- **Security & Fair Play:**
  - Game logic runs on **both client and server** for security & fair play.
  - **Anti-cheating mechanisms planned for future updates.**

### 2.2 Future Enhancements
- AI bots to replace missing players.
- Friend system for private matches.
- Spectator mode.
- Tournament management.
- Admin panel for moderation.

## 3. Technical Implementation

### 3.1 Tech Stack
- **Frontend:** Vanilla JavaScript (Initially planned Angular, but switched due to time constraints)
- **Backend:** Java Spring Boot (Database Connection), Node.js (WebSocket Server)
- **Database:** MySQL
- **Hosting:** Self-hosted

### 3.2 Performance & Availability
- The game should handle **4-player multiplayer matches** smoothly.
- WebSocket latency will be minimized to ensure real-time gameplay.
- The game will be **browser-based, requiring no downloads**.

## 4. Development Plan

### 4.1 10-Day MVP Development
- **Core gameplay mechanics (OMBI)**  
- **Multiplayer WebSocket functionality**  
- **UI with essential screens**  
- **Different rule sets for OMBI**  
- **Waiting system for players to join**  

### 4.2 Post 10-Day Enhancements
- **AI bots to fill in missing players**  
- **Leaderboard & profile customization**  
- **Private matches & friend invites**  
- **Spectator mode & tournament management**  

## 5. Risks & Challenges
- **Lack of AI in first release:** Matches will require four real players to start.
- **Server reliability:** Self-hosting may lead to occasional downtime.
- **Security vulnerabilities:** Basic anti-cheating mechanisms not included in the first release.
- **Adoption by target audience:** Needs awareness-building among Sri Lankan players.
- **Frontend learning curve avoided:** Initially planned to use Angular, but due to limited time, learning Angular could delay the outcome. Vanilla JavaScript ensures a faster development process and a better product within the time frame.

## 6. Conclusion
OmbiArenaLK aims to **preserve and modernize Sri Lankan card games** by bringing them into the digital space. The **10-day MVP** will focus on **gameplay, WebSocket integration, and a waiting system for multiplayer**, with plans to expand the platform in future updates. If the **10-day expansion plan** is successful, the project will be implemented as a **complete platform** and deployed on **24/7 available servers** instead of running on a personal computer. This project will provide a **culturally relevant and enjoyable** online gaming experience for players across Sri Lanka.