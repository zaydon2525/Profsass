import { pgTable, text, serial, integer, boolean, timestamp, uuid, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table with role-based access
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("student"), // admin, professor, student, parent
  isActive: boolean("is_active").default(true),
  mustChangePassword: boolean("must_change_password").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: uuid("created_by"),
});

// Groups/Classes table
export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  academicYear: varchar("academic_year", { length: 10 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by"),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#3b82f6"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Group-Subject assignments
export const groupSubjects = pgTable("group_subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").references(() => groups.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  professorId: uuid("professor_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student-Group assignments
export const studentGroups = pgTable("student_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  groupId: uuid("group_id").references(() => groups.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Course materials
export const materials = pgTable("materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  fileSize: integer("file_size").notNull(),
  groupId: uuid("group_id").references(() => groups.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Grades table
export const grades = pgTable("grades", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => users.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  groupId: uuid("group_id").references(() => groups.id).notNull(),
  gradeValue: decimal("grade_value", { precision: 5, scale: 2 }).notNull(),
  maxValue: decimal("max_value", { precision: 5, scale: 2 }).notNull().default("20"),
  gradeType: varchar("grade_type", { length: 50 }).notNull(), // exam, homework, quiz, project
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  gradedBy: uuid("graded_by").references(() => users.id).notNull(),
  gradedAt: timestamp("graded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity logs
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: uuid("entity_id"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments on materials
export const materialComments = pgTable("material_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  materialId: uuid("material_id").references(() => materials.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weekly schedule/timetable
export const schedules = pgTable("schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").references(() => groups.id).notNull(),
  subjectId: uuid("subject_id").references(() => subjects.id).notNull(),
  professorId: uuid("professor_id").references(() => users.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM format
  endTime: varchar("end_time", { length: 5 }).notNull(), // HH:MM format
  room: varchar("room", { length: 50 }),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages/Posts for groups
export const groupMessages = pgTable("group_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").references(() => groups.id).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  isImportant: boolean("is_important").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments on group messages
export const messageComments = pgTable("message_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  messageId: uuid("message_id").references(() => groupMessages.id).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Message likes
export const messageLikes = pgTable("message_likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  messageId: uuid("message_id").references(() => groupMessages.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  createdGroups: many(groups),
  studentGroups: many(studentGroups),
  groupSubjects: many(groupSubjects),
  uploadedMaterials: many(materials),
  grades: many(grades),
  gradedGrades: many(grades),
  activityLogs: many(activityLogs),
  notifications: many(notifications),
  comments: many(materialComments),
}));

export const groupsRelations = relations(groups, ({ many, one }) => ({
  creator: one(users, { fields: [groups.createdBy], references: [users.id] }),
  studentGroups: many(studentGroups),
  groupSubjects: many(groupSubjects),
  materials: many(materials),
  grades: many(grades),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  groupSubjects: many(groupSubjects),
  materials: many(materials),
  grades: many(grades),
}));

export const groupSubjectsRelations = relations(groupSubjects, ({ one }) => ({
  group: one(groups, { fields: [groupSubjects.groupId], references: [groups.id] }),
  subject: one(subjects, { fields: [groupSubjects.subjectId], references: [subjects.id] }),
  professor: one(users, { fields: [groupSubjects.professorId], references: [users.id] }),
}));

export const studentGroupsRelations = relations(studentGroups, ({ one }) => ({
  student: one(users, { fields: [studentGroups.studentId], references: [users.id] }),
  group: one(groups, { fields: [studentGroups.groupId], references: [groups.id] }),
}));

export const materialsRelations = relations(materials, ({ one, many }) => ({
  group: one(groups, { fields: [materials.groupId], references: [groups.id] }),
  subject: one(subjects, { fields: [materials.subjectId], references: [subjects.id] }),
  uploader: one(users, { fields: [materials.uploadedBy], references: [users.id] }),
  comments: many(materialComments),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(users, { fields: [grades.studentId], references: [users.id] }),
  subject: one(subjects, { fields: [grades.subjectId], references: [subjects.id] }),
  group: one(groups, { fields: [grades.groupId], references: [groups.id] }),
  grader: one(users, { fields: [grades.gradedBy], references: [users.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
}));

export const materialCommentsRelations = relations(materialComments, ({ one }) => ({
  material: one(materials, { fields: [materialComments.materialId], references: [materials.id] }),
  user: one(users, { fields: [materialComments.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  group: one(groups, { fields: [schedules.groupId], references: [groups.id] }),
  subject: one(subjects, { fields: [schedules.subjectId], references: [subjects.id] }),
  professor: one(users, { fields: [schedules.professorId], references: [users.id] }),
}));

export const groupMessagesRelations = relations(groupMessages, ({ one, many }) => ({
  group: one(groups, { fields: [groupMessages.groupId], references: [groups.id] }),
  author: one(users, { fields: [groupMessages.authorId], references: [users.id] }),
  comments: many(messageComments),
  likes: many(messageLikes),
}));

export const messageCommentsRelations = relations(messageComments, ({ one }) => ({
  message: one(groupMessages, { fields: [messageComments.messageId], references: [groupMessages.id] }),
  author: one(users, { fields: [messageComments.authorId], references: [users.id] }),
}));

export const messageLikesRelations = relations(messageLikes, ({ one }) => ({
  message: one(groupMessages, { fields: [messageLikes.messageId], references: [groupMessages.id] }),
  user: one(users, { fields: [messageLikes.userId], references: [users.id] }),
}));

// Schema definitions
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
  createdAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  createdAt: true,
});

export const insertGradeSchema = createInsertSchema(grades).omit({
  id: true,
  createdAt: true,
  gradedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({
  id: true,
  createdAt: true,
});

export const insertMessageCommentSchema = createInsertSchema(messageComments).omit({
  id: true,
  createdAt: true,
});

export const insertMessageLikeSchema = createInsertSchema(messageLikes).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Grade = typeof grades.$inferSelect;
export type InsertGrade = z.infer<typeof insertGradeSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type MessageComment = typeof messageComments.$inferSelect;
export type InsertMessageComment = z.infer<typeof insertMessageCommentSchema>;
export type MessageLike = typeof messageLikes.$inferSelect;
export type InsertMessageLike = z.infer<typeof insertMessageLikeSchema>;

// Additional schemas for specific operations
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "Confirmation du mot de passe requise"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const createUserSchema = insertUserSchema.extend({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "Confirmation du mot de passe requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const uploadFileSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  description: z.string().optional(),
  groupId: z.string().uuid("ID de groupe invalide"),
  subjectId: z.string().uuid("ID de matière invalide"),
  fileName: z.string().min(1, "Nom de fichier requis"),
  fileUrl: z.string().url("URL de fichier invalide"),
  fileType: z.string().min(1, "Type de fichier requis"),
  fileSize: z.number().positive("Taille de fichier invalide"),
});

export const createGradeSchema = insertGradeSchema.extend({
  gradeValue: z.number().min(0, "La note doit être positive").max(20, "La note ne peut pas dépasser 20"),
  maxValue: z.number().min(1, "La note maximale doit être supérieure à 0").default(20),
});

export type LoginData = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UploadFileData = z.infer<typeof uploadFileSchema>;
export type CreateGradeData = z.infer<typeof createGradeSchema>;

// Role validation
export const ROLES = {
  ADMIN: 'admin',
  PROFESSOR: 'professor',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export const roleSchema = z.enum(['admin', 'professor', 'student', 'parent']);

// File type validation
export const ALLOWED_FILE_TYPES = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/gif': 'GIF',
  'video/mp4': 'MP4',
  'video/quicktime': 'MOV',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
} as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// Grade types
export const GRADE_TYPES = {
  EXAM: 'exam',
  HOMEWORK: 'homework',
  QUIZ: 'quiz',
  PROJECT: 'project',
  PARTICIPATION: 'participation',
} as const;

export const gradeTypeSchema = z.enum(['exam', 'homework', 'quiz', 'project', 'participation']);

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const notificationTypeSchema = z.enum(['info', 'success', 'warning', 'error']);
