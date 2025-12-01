const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'members.json');

async function readMembers() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

// GET /members
app.get('/members', async (req, res) => {
  try {
    const members = await readMembers();
    res.json(members);
  } catch (err) {
    console.error('read error', err);
    res.status(500).json({ error: 'Unable to read member data' });
  }
});

// GET /members/:id
app.get('/members/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const members = await readMembers();
    const member = members.find(m => m.id === id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    console.error('read error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port http://localhost:${PORT}`));

