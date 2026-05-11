# 🛠️ Vela Admin Panel

> **The central management interface for the Vela platform.**

The Admin Panel is a high-performance [Next.js](https://nextjs.org/) application designed for clinical staff and administrators to manage questionnaires, scoring rules, user segments (targets), and system content.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescript.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) & Radix UI
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Data Fetching**: Native Fetch with async/await patterns

---

## 🚀 Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Environment Configuration:**
    - Copy `.env.example` to `.env.local`.
    - Configure `NEXT_PUBLIC_API_URL` to point to your Vela Backend API.

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🏗️ Project Structure

- `app/`: Next.js App Router (pages and layouts).
- `components/`: Reusable UI components and complex form builders.
- `lib/`: API client and shared utility functions.
- `public/`: Static assets and icons.

---

## 📜 Key Features

- **Form Builder**: Sophisticated interface for creating multi-section clinical questionnaires.
- **Rule Engine Editor**: Manage complex scoring logic and clinical alerts.
- **Target Manager**: Define and manage user segments for automated clinical tagging.
- **Responsive Design**: Optimized for desktop management and tablet review.
