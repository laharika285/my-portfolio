const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let supabase = null;
try {
  const { createClient } = require('@supabase/supabase-js');
  const SUPABASE_URL = process.env.SUPABASE_URL || '';
  const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client configured');
  }
} catch (err) {
  // supabase package not installed or not configured — we'll fallback to local store
  console.log('Supabase not configured or not installed, using local JSON store');
}

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const contactsFile = path.join(dataDir, 'contacts.json');

const skills = [
  { category: 'Languages', items: ['Python', 'Java', 'SQL'] },
  { category: 'Web Technologies', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'] },
  { category: 'AI & Data Science', items: ['Machine Learning', 'Deep Learning', 'NLP', 'Statistics'] },
  { category: 'Tools', items: ['Power BI', 'Data Science'] },
  { category: 'Soft Skills', items: ['Critical Thinking', 'Adaptability', 'Communication', 'Teamwork'] },
];

const projects = [
  {
    id: 1,
    title: 'Network Anomaly Detection',
    description: 'Machine learning models to detect anomalous network activity, identifying potential intrusions and threats in real time.',
    tech: ['Random Forest', 'SVM', 'Isolation Forest'],
  },
  {
    id: 2,
    title: 'Diabetes Prediction',
    description: 'Classification models trained on medical datasets to predict the likelihood of diabetes in patients with high accuracy.',
    tech: ['Python', 'Classification', 'ML'],
  },
  {
    id: 3,
    title: 'Sales Prediction',
    description: 'Regression-based models developed for accurate sales forecasting, enabling data-driven business decisions.',
    tech: ['Regression', 'Python', 'Statistics'],
  },
  {
    id: 4,
    title: 'Titanic ML Pipeline',
    description: 'End-to-end machine learning workflow covering data preprocessing, feature engineering, supervised and unsupervised learning using the Titanic dataset.',
    tech: ['Data Cleaning', 'Linear Regression', 'Clustering'],
  },
  {
    id: 5,
    title: 'ShopSmart Optimizer',
    description: 'Smart purchase optimizer designed with modular functions for clean code separation and efficient JSON-based data persistence.',
    tech: ['Python', 'JSON', 'Modular Design'],
  },
  {
    id: 6,
    title: 'SmartHome Dashboard UI',
    description: 'A responsive smart home dashboard replica featuring reusable UI components and modular CSS for scalability and maintainability.',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
];

const contactInfo = {
  email: 'laharika285@gmail.com',
  phone: '+917981217530',
  linkedin: 'https://www.linkedin.com/in/kirthi-laharika-77b220345/',
  github: 'https://github.com/laharika285',
};

function ensureDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(contactsFile)) {
    fs.writeFileSync(contactsFile, '[]', 'utf8');
  }
}

function readContacts() {
  ensureDataStore();
  const raw = fs.readFileSync(contactsFile, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function saveContacts(contacts) {
  ensureDataStore();
  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/skills', (req, res) => {
  res.json({ skills });
});

app.get('/api/projects', (req, res) => {
  res.json({ projects });
});

app.get('/api/contact-info', (req, res) => {
  res.json(contactInfo);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const contactEntry = {
    id: Date.now(),
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    submittedAt: new Date().toISOString(),
  };

  // If Supabase is configured, insert into the `contacts` table there
  if (supabase) {
    (async () => {
      try {
        const { data, error } = await supabase.from('contacts').insert([
          { name: contactEntry.name, email: contactEntry.email, message: contactEntry.message, submitted_at: contactEntry.submittedAt }
        ]);
        if (error) {
          console.error('Supabase insert error:', error);
          // fallback to local file store
          const contacts = readContacts();
          contacts.push(contactEntry);
          saveContacts(contacts);
          return res.status(201).json({ success: true, contact: contactEntry, warning: 'Saved locally after Supabase error' });
        }
        return res.status(201).json({ success: true, contact: contactEntry, supabase: data });
      } catch (err) {
        console.error('Supabase exception:', err);
        const contacts = readContacts();
        contacts.push(contactEntry);
        saveContacts(contacts);
        return res.status(201).json({ success: true, contact: contactEntry, warning: 'Saved locally after Supabase exception' });
      }
    })();
    return;
  }

  // Default local file storage
  const contacts = readContacts();
  contacts.push(contactEntry);
  saveContacts(contacts);

  res.status(201).json({ success: true, contact: contactEntry });
});

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  ensureDataStore();
  console.log(`Portfolio backend is running on http://localhost:${PORT}`);
});
