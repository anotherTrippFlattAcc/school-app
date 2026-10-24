export interface Teacher {
    id: number;
    name: string;
    subject: string;
}

export interface Student {
    id: number;
    name: string;
    group: string;
    teacherId: number | null;
}

export type NewTeacher = Omit<Teacher, 'id'>;
export type NewStudent = Omit<Student, 'id'>;
