const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const COLLECTIONS = ['neighborhoods', 'residents', 'trucks', 'pickup_schedules', 'issue_reports'];
const client = new MongoClient('mongodb://127.0.0.1:27017');
let db;

const check = (req, res, next) =>
  COLLECTIONS.includes(req.params.col) ? next() : res.status(404).json({ error: 'Unknown collection' });

// Report: unresolved issues per neighborhood (aggregation + $lookup)
app.get('/api/reports/unresolved', async (req, res) => {
  const out = await db.collection('issue_reports').aggregate([
    { $match: { status: { $ne: 'Resolved' } } },
    { $group: { _id: '$neighborhood_id', unresolved: { $sum: 1 } } },
    { $lookup: { from: 'neighborhoods', localField: '_id', foreignField: '_id', as: 'n' } },
    { $unwind: '$n' },
    { $project: { _id: 0, neighborhood: '$n.name', unresolved: 1 } },
    { $sort: { unresolved: -1 } }
  ]).toArray();
  res.json(out);
});

// Read all
app.get('/api/:col', check, async (req, res) => {
  res.json(await db.collection(req.params.col).find().toArray());
});

// Create
app.post('/api/:col', check, async (req, res) => {
  const doc = req.body;
  doc._id = doc._id || req.params.col.slice(0, 2).toUpperCase() + Date.now().toString(36).toUpperCase();
  if (req.params.col === 'issue_reports') {
    doc.reported_at = new Date();
    doc.resolved_at = null;
    doc.status = doc.status || 'Open';
  }
  await db.collection(req.params.col).insertOne(doc);
  res.status(201).json(doc);
});

// Update
app.put('/api/:col/:id', check, async (req, res) => {
  const changes = req.body;
  delete changes._id;
  if (req.params.col === 'issue_reports' && changes.status === 'Resolved') changes.resolved_at = new Date();
  const r = await db.collection(req.params.col).updateOne({ _id: req.params.id }, { $set: changes });
  res.json({ matched: r.matchedCount, modified: r.modifiedCount });
});

// Delete
app.delete('/api/:col/:id', check, async (req, res) => {
  const r = await db.collection(req.params.col).deleteOne({ _id: req.params.id });
  res.json({ deleted: r.deletedCount });
});

client.connect().then(() => {
  db = client.db('waste_management_db');
  app.listen(3000, () => console.log('Server running at http://localhost:3000'));
});