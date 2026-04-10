# Qrify - Advanced QR Code Generator
[https://www.qr.frameworkteam.com/](https://www.qr.frameworkteam.com/)
Qrify is a robust, full-stack web application designed for generating, customizing, and managing dynamic QR codes. Features include customizable styles (colors, eye shapes, embedded logos) and user management for saving and tracking QR code history.

## Tech Stack

This project is built using modern web development tools and best practices:

### Core Frontend
* **[React 18](https://reactjs.org/)**: The core UI library.
* **[Vite](https://vitejs.dev/)**: Lightning-fast build tool and development server.
* **[TypeScript](https://www.typescriptlang.org/)**: Statically typed JavaScript for robust code maintainability.
* **[React Router DOM](https://reactrouter.com/)**: Declarative routing system for single-page applications.

### Styling & Component Library
* **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid, responsive UI development.
* **[Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)**: Accessible, unstyled React UI primitives used as the foundation for the design system.
* **[Lucide React](https://lucide.dev/)**: Clean and consistent iconography.

### State Management & Form Handling
* **[TanStack React Query](https://tanstack.com/query/latest)**: Powerful asynchronous state management, caching, and data fetching.
* **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible, and extensible forms.
* **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and input validation.

### Backend Infrastructure
* **[Supabase](https://supabase.com/)**: An open-source Firebase alternative powering the backend:
  * **PostgreSQL Database** for securely storing user profiles, QR code metadata, and settings.
  * **Authentication** handling secure sign-ups and logins.
  * **Row Level Security (RLS)** ensuring users modify and view only their own resources.
* **[Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)**: Official client for database and auth interactions.

## QR Code Libraries & Capabilities

A major feature of Qrify is its extensive customization capabilities, powered by specialized libraries:

* **[qr-code-styling](https://qr-code-styling.com/)**: The primary powerhouse for generating visually customized QR codes. It enables advanced features like:
  * Custom foreground and background coloring.
  * Distinctive dot styles and corner "eye" shapes (e.g., squares, dots).
  * Direct embedding of central logos seamlessly into the QR pattern.
* **[qrcode.react](https://github.com/zpao/qrcode.react)**: Used for responsive, lightweight react specific implementations of code generation when raw styling isn't immediately required.

### Exporting & Rendering Tools
To allow users to export their customized designs efficiently:
* **[html-to-image](https://github.com/bubkoo/html-to-image)**: Utilized to convert the styled DOM elements into downloadable raster graphic formats like PNG and JPEG.
* **[jspdf](https://github.com/parallax/jsPDF)**: Used for converting elements to reliable PDF outputs for print-ready solutions.


