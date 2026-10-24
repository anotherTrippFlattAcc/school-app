import type { NewStudent, NewTeacher, Student, Teacher } from './types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch('/api' + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Ошибка ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getTeachers: () => request<Teacher[]>('/teachers'),
  addTeacher: (teacher: NewTeacher) =>
    request<Teacher>('/teachers', { method: 'POST', body: JSON.stringify(teacher) }),
  deleteTeacher: (id: number) => request<void>(`/teachers/${id}`, { method: 'DELETE' }),

  getStudents: (teacherId?: number) =>
    request<Student[]>(teacherId === undefined ? '/students' : `/students?teacherId=${teacherId}`),
  addStudent: (student: NewStudent) =>
    request<Student>('/students', { method: 'POST', body: JSON.stringify(student) }),
  updateStudent: (id: number, changes: Partial<NewStudent>) =>
    request<Student>(`/students/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteStudent: (id: number) => request<void>(`/students/${id}`, { method: 'DELETE' }),
};
