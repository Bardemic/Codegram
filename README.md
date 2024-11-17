# Codegram: Online Programming Tutoring Service

Welcome to **Codegram**, the premier platform for one-on-one programming tutoring. Codegram enables seamless collaboration between tutors and students with real-time code synchronization, video/audio sharing, and a user-friendly interface.

## Features

- **One-on-One Programming Tutoring**: Personalized tutoring sessions tailored to individual needs.
- **Real-Time Code Sync**: Collaborate with your tutor or student in real time using synchronized code editors.
- **Video and Audio Sharing**: Communicate effectively with high-quality video and audio streams during tutoring sessions.

## Technologies Used

- **Frontend**:
  - **JavaScript with Next.js**: Ensuring a fast, scalable, and SEO-friendly frontend experience.
  - **shadcn/ui Library**: For accessible and reusable UI components.
  - **Tailwind CSS**: A utility-first CSS framework for quick and efficient styling.

- **Realtime Communication**:
  - **WebRTC**: Enables high-quality video and audio sharing.
  - **WebSockets**: Powers the real-time code synchronization feature.

- **Backend**:
  - **Express.js**: A robust Node.js framework for handling server-side logic and WebSocket connections.

- **Code Collaboration**:
  - **Monaco Editor**: A powerful code editor for real-time coding sessions.

## Setup Instructions

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn
- A modern web browser that supports WebRTC

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/codegram.git
   cd codegram
   ```

2. Install frontend dependencies and run development server:
   ```bash
   cd web
   npm i -f
   npm run dev
   ```

3. In the different terminal install backend dependencies and also run development server:
   ```bash
   cd backend
   npm i -f
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.
