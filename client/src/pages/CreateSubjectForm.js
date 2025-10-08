import React, { useState } from 'react';
import { createSubject } from '../api';

export default function CreateSubjectForm(){
  const [form, setForm] = useState({
    year: 'SE', semester: 3, division: 'A', name: '', code: '', faculty: '', lecturesPerWeek: 5
  });
  const [msg,setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    try {
      const res = await createSubject(form);
      if(res.error) setMsg('Error: ' + res.error);
      else {
        setMsg('Subject saved: ' + res.name);
        setForm({...form, name:'', code:'', faculty:''});
      }
    } catch (err) {
      setMsg('Failed: ' + err.message);
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gap:8}}>
      <div style={{display:'flex', gap:8}}>
        <select value={form.year} onChange={e=>setForm({...form, year:e.target.value})}>
          <option>SE</option><option>TE</option><option>BE</option>
        </select>
        <input type="number" min="1" value={form.semester} onChange={e=>setForm({...form, semester: Number(e.target.value)})} />
        <input placeholder="Division (optional)" value={form.division} onChange={e=>setForm({...form, division: e.target.value})} />
      </div>

      <input required placeholder="Subject name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input required placeholder="Subject code (unique)" value={form.code} onChange={e=>setForm({...form, code:e.target.value})}/>
      <input placeholder="Faculty name" value={form.faculty} onChange={e=>setForm({...form, faculty:e.target.value})}/>
      <input type="number" min="0" placeholder="Lectures per week" value={form.lecturesPerWeek} onChange={e=>setForm({...form, lecturesPerWeek: Number(e.target.value)})}/>
      <button type="submit">Save Subject</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
