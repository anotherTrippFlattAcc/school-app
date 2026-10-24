import { useState } from 'react';
import type { NewTeacher, Student, Teacher } from '../types';

interface Props {
  teachers: Teacher[];
  students: Student[];
  onAdd: (teacher: NewTeacher) => void;
  onDelete: (id: number) => void;
}

export default function TeacherPanel({ teachers, students, onAdd, onDelete }: Props) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');

  const countStudents = (teacherId: number) =>
    students.filter((s) => s.teacherId === teacherId).length;

  return (
    <section className="panel">
      <h2>Преподаватели ({teachers.length})</h2>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !subject.trim()) return;
          onAdd({ name, subject });
          setName('');
          setSubject('');
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ФИО" />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Предмет" />
        <button type="submit">Добавить</button>
      </form>

      <ul className="list">
        {teachers.map((t) => (
          <li key={t.id}>
            <div>
              <strong>{t.name}</strong>
              <span className="muted">
                {t.subject} · студентов: {countStudents(t.id)}
              </span>
            </div>
            <button className="danger" onClick={() => onDelete(t.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
