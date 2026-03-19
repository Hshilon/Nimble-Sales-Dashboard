# Financial Dashboard

A React-based financial management dashboard built with Vite and Recharts.

## Features

- **Overview Dashboard**: Track monthly targets, completed amounts, and progress
- **Client Analysis**: View all clients with their total amounts and funding sources
- **Supplier Management**: Filter and manage suppliers by client
- **Funder Breakdown**: Detailed breakdown of requests by funding source
- **Pipeline Management**: Track and manage deals in progress with probability weighting
- **Complete Requests**: View all requests with advanced filtering by client and funder

## Tech Stack

- React 18.2
- Vite 5.0
- Recharts 2.10
- Tailwind CSS (via inline styles)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
  ├── App.jsx       # Main dashboard component
  ├── main.jsx      # React entry point
  └── index.css     # Global styles
index.html          # HTML template
vite.config.js      # Vite configuration
package.json        # Project dependencies
```

## Features

### Overview Tab
- KPI cards showing monthly targets and progress
- Progress bar with real-time percentage
- Bar chart of top 8 clients
- Pie chart showing funder distribution

### Client Tab
- Sortable table of all clients
- Total amounts in ILS/USD
- Funder information
- Request counts

### Supplier Tab
- Filter suppliers by client
- Detailed supplier breakdown
- Client and funder information

### Funder Tab
- Grid view of all funders
- Sub-tables showing client breakdown per funder
- Sorted by total amount

### Pipeline Tab
- Expected deal values with probability weighting
- Breakdown by portfolio manager
- Advanced filtering
- Status indicators

### All Requests Tab
- Complete request listing
- Advanced filtering by client and funder
- Currency conversion (USD to ILS)
- Status badges

## Currency Settings

- USD Exchange Rate: ₪3.65
- Monthly Target: ₪78,000,000

Edit the constants at the top of `App.jsx` to adjust these values.
