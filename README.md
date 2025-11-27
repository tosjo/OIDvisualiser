# OID Visualizer

A lightweight web application to visualize and manage Object Identifiers (OIDs) with hierarchical tree views and searchable tables.

## Features

- **Tree View**: Navigate OID hierarchies with an expandable/collapsible tree
- **Table View**: Search and filter OIDs in a list format
- **CRUD Operations**: Add, edit, and delete custom OIDs
- **oid-base.com Integration**: Look up OID information from the public registry
- **Import/Export**: Save and load your OID data as JSON files
- **Local Storage**: Automatic backup of your data in the browser

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone git@github.com:tosjo/OIDvisualiser.git
cd OIDvisualiser

# Install dependencies
npm install
```

### Running the Application

**Development mode (frontend only):**
```bash
npm run dev
```

**Full functionality (with oid-base.com lookups):**
```bash
npm start
```

Then open http://localhost:5173 in your browser.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### Adding OIDs

1. Click the **Add OID** button
2. Enter the OID (e.g., `1.2.840.113549`)
3. Optionally click **Lookup** to fetch information from oid-base.com
4. Fill in the name, description, and any comments
5. Click **Add OID** to save

### Viewing OIDs

- Use **Tree View** to see hierarchical relationships
- Use **Table View** to search and filter OIDs
- Click on any OID to view its details

### Import/Export Data

- Click **Export** to download your OID data as a JSON file
- Click **Import** to load OIDs from a JSON file
- A sample file is available at `data/sample-oids.json`

## Data Format

OID data is stored in JSON format:

```json
{
  "version": "1.0",
  "lastModified": "2025-11-27T00:00:00Z",
  "entries": [
    {
      "oid": "1.2.840.113549",
      "name": "rsadsi",
      "description": "RSA Data Security, Inc.",
      "comments": "Used for PKCS standards",
      "asnNotation": "{iso(1) member-body(2) us(840) rsadsi(113549)}",
      "createdAt": "2025-11-27T00:00:00Z",
      "modifiedAt": "2025-11-27T00:00:00Z"
    }
  ]
}
```

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express (proxy server only)

## License

ISC
