// ── data.js — mock data constants shared across pages ─────────────────────
// Replace with real API calls when connecting to your backend.

// BACKEND: GET /api/documents → replace with real fetch
const INIT_DOCS = [
  { id: 1, name: 'Company Policy 2024.pdf',  type: 'PDF',  size: '2.4 MB', status: 'indexed',    chunks: 142, uploadedAt: '2 days ago',  uploadedBy: 'Alex Johnson' },
  { id: 2, name: 'Product Handbook Q3.docx', type: 'DOCX', size: '1.1 MB', status: 'indexed',    chunks: 87,  uploadedAt: '5 days ago',  uploadedBy: 'Maria Garcia' },
  { id: 3, name: 'Technical Specs v2.1.pdf', type: 'PDF',  size: '4.7 MB', status: 'processing', chunks: 0,   uploadedAt: '1 hour ago',  uploadedBy: 'Alex Johnson' },
  { id: 4, name: 'Onboarding Guide.md',      type: 'MD',   size: '0.3 MB', status: 'indexed',    chunks: 34,  uploadedAt: '1 week ago',  uploadedBy: 'Sam Lee'      },
  { id: 5, name: 'Legal Terms 2024.pdf',     type: 'PDF',  size: '0.9 MB', status: 'error',      chunks: 0,   uploadedAt: '3 days ago',  uploadedBy: 'Maria Garcia' },
  { id: 6, name: 'Engineering Runbook.txt',  type: 'TXT',  size: '0.2 MB', status: 'indexed',    chunks: 21,  uploadedAt: '2 weeks ago', uploadedBy: 'Sam Lee'      },
];

// BACKEND: GET /api/admins → replace with real fetch
const INIT_ADMINS = [
  { id: 1, name: 'Alex Johnson',  email: 'alex@company.com',   role: 'Super Admin', status: 'active',   lastLogin: '2 minutes ago', color: '#2a85ff' },
  { id: 2, name: 'Maria Garcia',  email: 'maria@company.com',  role: 'Admin',       status: 'active',   lastLogin: '1 hour ago',    color: '#00c896' },
  { id: 3, name: 'Sam Lee',       email: 'sam@company.com',    role: 'Editor',      status: 'active',   lastLogin: '3 hours ago',   color: '#faad14' },
  { id: 4, name: 'Jordan Kim',    email: 'jordan@company.com', role: 'Viewer',      status: 'inactive', lastLogin: '2 days ago',    color: '#9b59b6' },
];

// File-type badge colours used in the Knowledge Base table
const TYPE_COLORS = {
  PDF:  { bg: '#fff1f0', color: '#ff4d4f' },
  DOCX: { bg: '#e8f1ff', color: '#2a85ff' },
  MD:   { bg: '#e0faf4', color: '#00c896' },
  TXT:  { bg: '#fffbe6', color: '#faad14' },
};
