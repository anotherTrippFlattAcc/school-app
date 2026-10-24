import { Router } from 'express';
import { nextId, save, students, teachers } from '../data';
import type { Student } from '../types';

const router = Router();

const teacherExists = (id: number | null | undefined) =>
  id == null || teachers.some((t) => t.id === id);

router.get('/', (req, res) => {
  const raw = req.query.teacherId;
  if (typeof raw !== 'string') {
    res.json(students);
    return;
  }
  const id = Number(raw);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'teacherId должен быть числом' });
    return;
  }
  res.json(students.filter((s) => s.teacherId === id));
});

router.post('/', (req, res) => {
  const { name, group, teacherId = null } = (req.body ?? {}) as Partial<Student>;

  if (!name?.trim() || !group?.trim()) {
    res.status(400).json({ error: 'Укажите ФИО и группу' });
    return;
  }
  if (!teacherExists(teacherId)) {
    res.status(400).json({ error: 'Такого преподавателя нет' });
    return;
  }

  const student: Student = { id: nextId(), name: name.trim(), group: group.trim(), teacherId };
  students.push(student);
  save();
  res.status(201).json(student);
});

router.patch('/:id', (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));
  if (!student) {
    res.status(404).json({ error: 'Студент не найден' });
    return;
  }

  const { name, group, teacherId } = (req.body ?? {}) as Partial<Student>;
  if (!teacherExists(teacherId)) {
    res.status(400).json({ error: 'Такого преподавателя нет' });
    return;
  }

  if (group !== undefined && !group.trim()) {
    res.status(400).json({ error: 'Группа не может быть пустой' });
    return;
  }

  if (name !== undefined) student.name = name;
  if (group !== undefined) student.group = group.trim();
  if (teacherId !== undefined) student.teacherId = teacherId;
  save();
  res.json(student);
});

router.delete('/:id', (req, res) => {
  const index = students.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Студент не найден' });
    return;
  }
  students.splice(index, 1);
  save();
  res.status(204).end();
});

export default router;
