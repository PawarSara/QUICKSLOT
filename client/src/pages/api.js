const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function fetchSubjects(year) {
  const q = year ? `?year=${encodeURIComponent(year)}` : '';
  const res = await fetch(`${API_BASE}/subjects${q}`);
  return res.json();
}

export async function createSubject(payload) {
  const res = await fetch(`${API_BASE}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function saveTimetable(payload) {
  const res = await fetch(`${API_BASE}/timetables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function getTimetable(year, division='') {
  const q = `?year=${encodeURIComponent(year)}&division=${encodeURIComponent(division)}`;
  const res = await fetch(`${API_BASE}/timetables${q}`);
  return res.json();
}
