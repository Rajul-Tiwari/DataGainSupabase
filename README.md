# Data Management System with Dual Sidebar Layout

A modern Next.js application featuring a dual sidebar layout with comprehensive data management capabilities powered by Supabase.

## Features

### 🎯 **Dual Sidebar Layout**
- **Main Sidebar**: Icon-only view that expands to show labels
- **Sub Sidebar**: Contextual content that slides out based on main navigation selection
- **Responsive Design**: Works seamlessly on desktop and mobile

### 📊 **Data Management**
- **Full CRUD Operations**: Create, Read, Update, Delete records
- **Real-time Search**: Search across all fields with instant results
- **Advanced Filtering**: Filter records by status with dropdown
- **Row Highlighting**: Toggle row highlighting with persistence
- **Loading States**: Visual feedback during database operations
- **Error Handling**: Comprehensive error messages and recovery

### 🗄️ **Database Integration**
- **Supabase Backend**: Cloud-hosted PostgreSQL database
- **Redux State Management**: Predictable state updates with Redux Toolkit
- **Async Operations**: Non-blocking database operations with proper loading states
- **Data Persistence**: All data stored in Supabase with automatic syncing

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Heroicons
- **State Management**: Redux Toolkit with async thunks
- **Database**: Supabase (PostgreSQL)
- **Development**: ESLint, TypeScript compiler

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
Follow the detailed instructions in [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to:
- Create a Supabase project
- Set up environment variables  
- Run the database schema
- Configure authentication (optional)

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## File Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── DataTable.tsx    # Main data table with CRUD
│   ├── DualSidebarLayout.tsx  # Layout with sidebars
│   ├── MainSidebar.tsx  # Primary navigation sidebar
│   ├── SubSidebar.tsx   # Secondary contextual sidebar
│   └── RecordModal.tsx  # Modal for create/edit/view
├── lib/
│   ├── api/             # Supabase API functions
│   ├── slices/          # Redux slices
│   ├── hooks.ts         # Typed Redux hooks
│   ├── providers.tsx    # Redux provider wrapper
│   ├── store.ts         # Redux store configuration
│   └── supabase.ts      # Supabase client setup
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses a `records` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| donor | TEXT | Donor name |
| panels | TEXT | Panel information |
| barcode | TEXT | Barcode number |
| source | TEXT | Source type |
| date | TEXT | Date in MM/DD/YYYY format |
| amount | TEXT | Amount in currency format |
| observed_by | TEXT | Observer name |
| status | TEXT | Status with constraints |
| is_highlighted | BOOLEAN | Row highlight flag |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Update timestamp |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
