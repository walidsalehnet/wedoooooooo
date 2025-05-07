const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

// تحميل ملف Firebase
const serviceAccount = require('./serviceAccountKey.json');  // تأكد من أن المسار صحيح إلى الملف

// تهيئة Firebase باستخدام الملف
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// الحصول على قائمة المستخدمين
app.get('/api/users', async (req, res) => {
  const usersSnapshot = await db.collection('users').get();
  const users = [];
  usersSnapshot.forEach(doc => users.push(doc.data()));
  res.json(users);
});

// إضافة رصيد للمستخدم
app.post('/api/add-balance', async (req, res) => {
  const { email, amount } = req.body;
  const userRef = db.collection('users').where('email', '==', email);
  const snapshot = await userRef.get();

  if (snapshot.empty) return res.status(404).send('User not found');
  snapshot.forEach(async doc => {
    const data = doc.data();
    await doc.ref.update({ wallet: (data.wallet || 0) + amount });
  });
  res.send('Balance added');
});

// خصم رصيد من المستخدم
app.post('/api/subtract-balance', async (req, res) => {
  const { email, amount } = req.body;
  const userRef = db.collection('users').where('email', '==', email);
  const snapshot = await userRef.get();

  if (snapshot.empty) return res.status(404).send('User not found');
  snapshot.forEach(async doc => {
    const data = doc.data();
    if ((data.wallet || 0) < amount) return res.status(400).send('Insufficient balance');
    await doc.ref.update({ wallet: data.wallet - amount });
  });
  res.send('Balance subtracted');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));