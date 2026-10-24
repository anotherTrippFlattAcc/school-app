import { Router } from 'express';
import { nextId, save, students, teachers } from '../data';
import type { Teacher } from '../types';

const router = Router();

router.get('/', (_req, res) => {
  res.json(teachers);
});

router.post('/', (req, res) => {
  const { name, subject } = (req.body ?? {}) as Partial<Teacher>;

  if (!name?.trim() || !subject?.trim()) {
    res.status(400).json({ error: 'Укажите ФИО и предмет' });
    return;
  }

  const teacher: Teacher = { id: nextId(), name: name.trim(), subject: subject.trim() };
  teachers.push(teacher);
  save();
  res.status(201).json(teacher);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = teachers.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Преподаватель не найден' });
    return;
  }
  if (students.some((s) => s.teacherId === id)) {
    res.status(409).json({ error: 'Нельзя удалить: за преподавателем закреплены студенты' });
    return;
  }

  teachers.splice(index, 1);
  save();
  res.status(204).end();
});

export default router;
