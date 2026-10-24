import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { Student, Teacher } from './types';

interface Saved {
  teachers: Teacher[];
  students: Student[];
  lastId: number;
}

const FILE = new URL('../data.json', import.meta.url);

const initial: Saved = {
  teachers: [
    { id: 1, name: 'Анна Петрова', subject: 'JavaScript' },
    { id: 2, name: 'Игорь Смирнов', subject: 'Базы данных' },
  ],
  students: [
    { id: 3, name: 'Мария Кузнецова', group: 'ИТ-21', teacherId: 1 },
    { id: 4, name: 'Дмитрий Орлов', group: 'ИТ-21', teacherId: 2 },
    { id: 5, name: 'Елена Соколова', group: 'ИТ-22', teacherId: null },
  ],
  lastId: 5,
};

const saved: Saved = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : initial;

export const teachers: Teacher[] = saved.teachers;
export const students: Student[] = saved.students;

let lastId = saved.lastId;
export const nextId = (): number => ++lastId;

export function save(): void {
  writeFileSync(FILE, JSON.stringify({ teachers, students, lastId }, null, 2));
}
