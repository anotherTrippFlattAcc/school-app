import { useEffect, useState } from 'react';
import { api } from '../api';
import type { NewStudent, Student, Teacher } from '../types';

interface Props {
  teachers: Teacher[];
  students: Student[];
  onAdd: (student: NewStudent) => void;
  onAssign: (studentId: number, teacherId: number | null) => void;
  onUpdateGroup: (studentId: number, group: string) => void;
  onDelete: (id: number) => void;
}

const toTeacherId = (value: string) => (value ? Number(value) : null);

export default function StudentPanel({ teachers, students, onAdd, onAssign, onUpdateGroup, onDelete, }: Props) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [search, setSearch] = useState('');

  const [filterId, setFilterId] = useState('');
  const [filtered, setFiltered] = useState<Student[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!filterId) return;
    let cancelled = false;
    api
      .getStudents(Number(filterId))
      .then((data) => { if (!cancelled) setFiltered(data); })
      .catch(() => { if (!cancelled) setFiltered([]); });
    return () => { cancelled = true; };
  }, [filterId, students]);

  const source = filterId ? filtered : students;
  const query = search.trim().toLowerCase();
  const visible = source.filter(
    (s) => s.name.toLowerCase().includes(query) || s.group.toLowerCase().includes(query),
  );

  const byGroup = students.reduce<Record<string, number>>((acc, s) => {
    acc[s.group] = (acc[s.group] ?? 0) + 1;
    return acc;
  }, {});
  const unassigned = students.filter((s) => s.teacherId === null).length;

  function saveGroup(s: Student) {
    const value = draft.trim();
    setEditingId(null);
    if (value && value !== s.group) onUpdateGroup(s.id, value);
  }

  const teacherOptions = teachers.map((t) => (
    <option key={t.id} value={t.id}>
      {t.name}
    </option>
  ));

  return (
    <section className="panel">
      <h2>Студенты ({students.length})</h2>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !group.trim()) return;
          onAdd({ name, group, teacherId: toTeacherId(teacherId) });
          setName('');
          setGroup('');
          setTeacherId('');
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ФИО" />
        <input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Группа" />
        <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
          <option value="">Без преподавателя</option>
          {teacherOptions}
        </select>
        <button type="submit">Добавить</button>
      </form>

      <div className="stats">
        {Object.entries(byGroup).map(([g, n]) => (
          <span key={g}>
            {g}: {n}
          </span>
        ))}
        <span>Без преподавателя: {unassigned}</span>
      </div>

      <div className="filters">
        <input
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по ФИО или группе"
        />
        <select value={filterId} onChange={(e) => setFilterId(e.target.value)}>
          <option value="">Все преподаватели</option>
          {teacherOptions}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Группа</th>
            <th>Преподаватель</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>
                {editingId === s.id ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => saveGroup(s)}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                  />
                ) : (
                  <span
                    className="editable"
                    title="Нажмите, чтобы изменить"
                    onClick={() => { setEditingId(s.id); setDraft(s.group); }}
                  >
                    {s.group}
                  </span>
                )}
              </td>
              <td>
                <select
                  value={s.teacherId ?? ''}
                  onChange={(e) => onAssign(s.id, toTeacherId(e.target.value))}
                >
                  <option value="">— не назначен —</option>
                  {teacherOptions}
                </select>
              </td>
              <td>
                <button className="danger" onClick={() => onDelete(s.id)}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={4} className="muted">
                Никого не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
