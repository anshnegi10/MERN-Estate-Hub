# 🏠 EstateHub — UPES Student Housing Platform

> Find verified PGs, flats, and hostels near UPES Bidholi — built for students, by a student.

---

## 📖 Inspiration
During my 2nd year at UPES, finding PGs, hostels, and flats near Bidholi was difficult because listings were scattered and unreliable. This inspired the development of **EstateHub** to help students find verified accommodations near UPES more easily.

---

## ✨ Features
- 🔐 **JWT Authentication**: Secure login/register with HTTP-only cookie token storage.
- 🍃 **MongoDB Atlas Integration**: Reliable cloud database for users and properties.
- 🏘️ **Property Listings**: Detailed listings with price, beds, area, and amenities.
- 👥 **Owner Dashboard**: Dedicated interface for property owners to list and manage properties.
- 🗺️ **Leaflet Maps**: Interactive map-based search centered on Dehradun/UPES.
- 🛡️ **Safety Ratings**: Student-focused ratings for verified safety and comfort.
- 📱 **Responsive UI**: Fully mobile-friendly design using Tailwind CSS.
- 👤 **Profile Dashboard**: Manage your account and saved properties.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://reactjs.org/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) + [Mongoose](https://mongoosejs.com/)
- **Authentication**: Custom JWT + HTTP-only cookies
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **Storage**: [Cloudinary](https://cloudinary.com/)

---

## 📸 Screenshots
*(Add your project screenshots here)*

### Home Page
![Home Page Placeholder]![alt text](<Screenshot 2026-05-09 010827.png>)

### Explore Page
![Explore Page Placeholder]![alt text](<Screenshot 2026-05-09 010941.png>)

### Login Page
![Login Page Placeholder]![alt text](<Screenshot 2026-05-09 010847.png>)

### Property Detail Page
![Property Detail Placeholder]![alt text](<Screenshot 2026-05-09 011012.png>)

### MongoDB Collections
![MongoDB Placeholder] ![alt text](<Screenshot 2026-05-09 012934.png>)
### Owner Listing Form
![Listing Form Placeholder]![alt text](<Screenshot 2026-05-09 012450.png>)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/anshnegi10/devops-project-ansh.git
cd estatehub_Minor_6thsem
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and copy the contents from `.env.example`:
```bash
cp .env.example .env.local
```
Fill in your credentials for MongoDB, JWT, Gemini, and Cloudinary.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure
```
estatehub_Minor_6thsem/
├── src/
│   ├── app/                # Next.js App Router (Pages & API)
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (public)/       # Public property routes
│   │   ├── api/            # Backend API endpoints
│   │   └── layout.tsx      # Main application layout
│   ├── components/         # UI Components (Cards, Navbar, Map)
│   ├── database/           # MongoDB models & connection logic
│   ├── services/           # Business logic layer
│   ├── lib/                # JWT & Auth utilities
│   └── utils/              # Helper functions & validation
├── public/                 # Static assets (images, icons)
└── .env.example            # Template for environment variables
```

---

## 🔮 Future Improvements
- **Real-time Chat**: Direct messaging between students and owners.
- **AI Recommendation System**: Personalised property suggestions based on preferences.
- **Advanced Filters**: Filter by price range, distance to UPES, and specific amenities.
- **Review Moderation**: Community-driven safety and quality reviews.

---

## 👨‍💻 Author
**Ansh Negi**  
UPES Dehradun | Semester 6  
Minor Project — Student Housing Discovery Platform
