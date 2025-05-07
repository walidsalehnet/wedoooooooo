import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  // تحميل المستخدمين عند تحميل الصفحة
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users");
      setUsers(res.data);
    } catch (error) {
      alert("فشل في تحميل المستخدمين. حاول مرة أخرى لاحقًا.");
    }
  };

  const updateBalance = async (type) => {
    const url =
      type === "add"
        ? "http://localhost:3000/api/add-balance"
        : "http://localhost:3000/api/subtract-balance";

    try {
      await axios.post(url, { email, amount: parseFloat(amount) });
      fetchUsers(); // تحديث قائمة المستخدمين بعد التحديث
      alert("تم التحديث بنجاح");
    } catch (error) {
      alert("فشل في تحديث الرصيد. حاول مرة أخرى.");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>لوحة تحكم الأدمن</h2>
      <div>
        <input
          type="text"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="المبلغ"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={() => updateBalance("add")}>➕ إضافة رصيد</button>
        <button onClick={() => updateBalance("sub")}>➖ خصم رصيد</button>
      </div>
      <h3>قائمة المستخدمين:</h3>
      <ul>
        {users.map((user, idx) => (
          <li key={idx}>
            {user.email} - {user.wallet} جنيه
          </li>
        ))}
      </ul>
    </div>
  );
}