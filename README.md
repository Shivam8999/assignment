# Dynamic JSON Form Generator

A React-based dynamic form generator that intelligently creates editable forms from any JSON configuration. The application automatically infers field types, supports nested objects, arrays, and provides a clean interface for editing complex JSON structures.

## 🚀 Live Demo

[View Live Application](https://citta-assignment.netlify.app/) *(Update with your deployment URL)*

## ✨ Features

### Core Functionality
- **Intelligent Schema Generation**: Automatically creates a typed JSON schema from any JSON configuration
- **Dynamic Form Rendering**: Renders form fields entirely from the schema (no hardcoded JSX)
- **Type-Aware Inputs**: Automatically detects and renders appropriate input types:
  - **Strings** → Text inputs
  - **Numbers** → Number inputs
  - **Booleans** → Checkboxes
  - **Arrays** → Array editor with add/remove functionality
  - **Nested Objects** → Collapsible nested sections

### User Experience
- **Read/Write Mode Toggle**: Switch between read-only and editable modes
- **Expandable/Collapsible Sections**: Minimize nested objects for better navigation
- **Real-time Updates**: Changes update the nested JSON structure in real-time
- **Form Validation**: Type-safe value conversion and validation
- **Clean UI**: Modern, responsive design with proper spacing and visual hierarchy

### Technical Highlights
- **No Hardcoding**: Works with any JSON structure - no field-specific code
- **Nested State Management**: Maintains original JSON structure (not flattened)
- **Clean Architecture**: Separated concerns with utility functions
- **Scalable**: Handles deeply nested objects and complex data structures

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **Axios 1.13.2** - HTTP client for API requests
- **CSS3** - Custom styling with dark/light mode support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v22 or higher)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd citta-AI-assignment/cittaAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The application will be available at `http://localhost:5173` (or the port shown in terminal)

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
cittaAI/
├── src/
│   ├── App.jsx              # Main application component
│   ├── DynamicForm.jsx      # Core dynamic form component
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles
│   ├── App.css              # App-specific styles
│   ├── utils/
│   │   ├── schemaUtils.js   # Schema creation and type inference
│   │   └── stateUtils.js    # Nested state management utilities
│   └── assets/              # Static assets
├── public/                  # Public assets
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🎯 How It Works

### Two-Step Process

1. **Schema Creation**: The application intelligently creates a typed JSON schema from the input JSON
   - Infers types (string, number, boolean, array, object)
   - Preserves structure and relationships
   - Handles nested objects and arrays

2. **Form Rendering**: The form is rendered entirely from the schema
   - No hardcoded field names
   - Works with any JSON structure
   - Maintains type safety

### Key Components

- **DynamicForm**: Main component that orchestrates schema creation and form rendering
- **schemaUtils**: Handles type inference and schema generation
- **stateUtils**: Manages nested state updates and value conversions

## 💡 Usage

1. **Enter API URL**: Input the URL of your JSON API endpoint (default: `http://localhost:3000/`)
2. **Fetch Data**: Click "Fetch & Generate Form" to load and parse the JSON
3. **Edit Values**: Modify any field values in the generated form
4. **Toggle Read-Only**: Use the checkbox to switch between read and write modes
5. **Expand/Collapse**: Click on nested object labels to expand or collapse sections
6. **Submit**: Click "Submit Form" to get the updated JSON configuration

## 🔧 Configuration

### Backend API

The application expects a JSON API endpoint that returns a JSON object. Update the default URL in `App.jsx` if needed:

```javascript
const [url, setUrl] = useState('http://localhost:3000/');
```

### CORS

Ensure your backend API has CORS enabled if accessing from a different origin.

## 🎨 Features in Detail

### Read/Write Mode
- **Read Mode**: All fields become read-only, preventing accidental edits
- **Write Mode**: All fields are editable (default)

### Expandable Sections
- Click the `+`/`−` button or the section label to expand/collapse nested objects
- All nested sections start expanded by default
- Maintains state across form updates

### Array Management
- Add new items to arrays
- Remove existing items
- Type-aware: maintains the correct data type for array items

## 🧪 Testing

The application has been tested with:
- Simple flat JSON objects
- Deeply nested objects (3+ levels)
- Arrays of primitives (strings, numbers, booleans)
- Mixed data structures
- Empty arrays and null values

## 📝 Notes

- The application does NOT use any library's built-in JSON-to-form conversion feature
- All schema creation and form rendering is custom-built
- The solution is scalable and works with any similarly structured JSON configuration


## 👤 Author

[Shivam Vishwakarma]

---

**Note**: This is a frontend-only application. Ensure your backend API is running and accessible for the form to fetch JSON data.
