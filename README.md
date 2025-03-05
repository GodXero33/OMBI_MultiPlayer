# OmbiArenaLK

OmbiArenaLK is a web-based platform designed for Sri Lankan players, particularly elders, to enjoy traditional card games online. The initial release features **OMBI**, with a scalable structure for adding more games in the future.

## 📁 Project Structure

```
OMBI/
├── docs/              # Database schema, documentation, and reports
├── OmbiBackend/       # Java Spring Boot backend (Database, API, and Authentication)
├── OmbiFrontend/      # Express.js static server (Serves UI)
├── OmbiWSServer/      # Node.js WebSocket server (Real-time multiplayer)
└── README.md          # Project overview and setup guide
```

## 🚀 Features
- **Real-time multiplayer** with WebSocket-based gameplay
- **User authentication & account management** (Handled in Spring Boot backend)
- **Simple & intuitive UI** tailored for elder users
- **Lobby system** for players to wait until enough players join
- **Secure & scalable architecture**
- **Future-proof:** AI bots, private matches, spectator mode, and tournaments

## 🛠️ Tech Stack
- **Frontend:** Express.js (Static file serving)
- **Backend:** Java Spring Boot (Database, API, Authentication)
- **WebSocket Server:** Node.js
- **Database:** MySQL
- **Hosting:** Self-hosted (Planned future cloud deployment)

## 🛆 Setup Guide
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/OmbiArenaLK.git
cd OmbiArenaLK
```

### 2️⃣ Backend Setup (Java Spring Boot)
```sh
cd OmbiBackend
# Configure database connection in application.properties
mvn clean install
mvn spring-boot:run
```

### 3️⃣ WebSocket Server Setup (Node.js)
```sh
cd OmbiWSServer
npm install
node game-server.js
```
In another terminal window:
```sh
cd OmbiWSServer
node lobby-server.js
```

### 4️⃣ Frontend Setup (Express.js Static Server)
To set up your frontend, follow these steps:

1. Navigate to the `OmbiFrontend` directory and install dependencies:
    ```sh
    cd OmbiFrontend
    npm install
    ```
2. Start the Express server:
    ```sh
    node server.js
    ```
This will serve the frontend UI as a static website.

### 5️⃣ Database Setup
In the `docs` folder, the `db.sql` file is provided for quick and error-free database creation. Simply import this file into your MySQL database to set up the schema.

## 📌 Future Enhancements
- **AI bots** for single-player & filling missing players
- **Friend system** for private matches
- **Spectator mode** & **Tournaments**
- **Cloud hosting** for 24/7 availability

## 🏆 Goal
OmbiArenaLK aims to **modernize traditional Sri Lankan card games** while keeping them accessible and enjoyable for all age groups.

---
🚀 *Work in progress. Stay tuned!*

