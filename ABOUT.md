# About MSSN Yabatech Digital Hub

The **MSSN Yabatech Digital Hub** is a premium, modern, and centralized digital platform developed for the **Muslim Students' Society of Nigeria (MSSN), Yaba College of Technology (Yabatech) Branch**. The application is designed to support students by bridging the gap between spiritual growth, academic excellence, and modern technology.

---

## 🌟 Key Features

### 1. **Resource Vault**
* **Academic Support**: Instant access to textbooks, past questions, and lecture notes organized by department and category.
* **Spiritual Library**: Repository of Islamic lecture audios, articles, and guides.
* **Force-Download Integration**: Cloudinary-powered URLs automatically configured to bypass in-browser rendering and prompt direct downloads for files like PDFs and textbooks.

### 2. **Digital Membership & Profiles**
* **Interactive Profiles**: Comprehensive user profile management where users can edit details (department, email, phone number) with live session updating (NextAuth dynamic state syncing).
* **Digital ID Cards**: Unique digital membership badge showing student info and verification status.
* **Secure Logout**: Easily accessible session termination options from both the global desktop navigation bar and user profile dashboard.

### 3. **Events Calendar**
* Centralized timeline of upcoming weekly seminars, orientation weeks, and special programs.
* Features countdowns, event details, and automated reminder request portals.

### 4. **Cloudinary Asset Gallery**
* High-performance, folder-restricted media gallery connecting to Cloudinary.
* Automatically sorts and routes files dynamically:
  * Images go to the homepage and main gallery.
  * PDF files, past questions, and notes are routed straight to the Resource Vault.
  * Prevents duplicate files or cross-directory spillover.

### 5. **Admin Panel**
* Secure administrative dashboard accessible only to accounts with `ADMIN` roles.
* Tools to manage registered members, approve or delete uploaded resources, edit site announcements, and track community metrics.

### 6. **Committee Applications**
* In-app application form for members to join executive committees including:
  * Welfare Committee
  * Academic Committee
  * Media & Publicity
  * Secretariat
  * Dawah Committee
  * Organizing Committee

### 7. **Multi-Channel Notifications**
* SMS broadcast support integrated using the **AfricasTalking** API.
* Email notifications powered by **Resend**.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js (v16 App Router)](https://nextjs.org/) | Core fullstack framework & routing |
| **Styling** | [Tailwind CSS (v4)](https://tailwindcss.com/) & CSS Modules | Responsive, custom dark/light styling |
| **Database** | PostgreSQL | Relational database storage |
| **ORM** | [Prisma](https://www.prisma.io/) | Database querying, migrations, & schema management |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) | Session management, security, & credential authentication |
| **Media Host** | [Cloudinary](https://cloudinary.com/) | Storage, optimization, & CDN delivery for PDFs, slides, and images |
| **SMS Gateway** | [AfricasTalking](https://africastalking.com/) | SMS-based broadcast notifications |
| **Email Service**| [Resend](https://resend.com/) | Transactional emails and newsletter communications |
| **Validation** | Zod & React Hook Form | Secure runtime form validation |
| **Animations** | Framer Motion | Fluid micro-animations & transitions |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.x or later)
* A running **PostgreSQL** instance

### Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mssnyct"
   NEXTAUTH_SECRET="your-nextauth-secret"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```
3. Run Prisma Migrations and Seed:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.
