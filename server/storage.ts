import { 
  users, groups, subjects, materials, grades, activityLogs, notifications, schedules, groupMessages, messageComments, messageLikes,
  type User, type InsertUser, type Group, type InsertGroup, 
  type Subject, type InsertSubject, type Material, type InsertMaterial,
  type Grade, type InsertGrade, type ActivityLog, type InsertActivityLog,
  type Notification, type InsertNotification, type Schedule, type InsertSchedule,
  type GroupMessage, type InsertGroupMessage, type MessageComment, type InsertMessageComment,
  type MessageLike, type InsertMessageLike
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Group operations
  getGroups(): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: string, updates: Partial<Group>): Promise<Group | undefined>;
  deleteGroup(id: string): Promise<boolean>;

  // Subject operations
  getSubjects(): Promise<Subject[]>;
  getSubject(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Material operations
  getMaterials(): Promise<Material[]>;
  getMaterial(id: string): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: string, updates: Partial<Material>): Promise<Material | undefined>;
  deleteMaterial(id: string): Promise<boolean>;

  // Grade operations
  getGrades(): Promise<Grade[]>;
  getGrade(id: string): Promise<Grade | undefined>;
  createGrade(grade: InsertGrade): Promise<Grade>;
  updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined>;
  deleteGrade(id: string): Promise<boolean>;

  // Activity log operations
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getActivities(): Promise<ActivityLog[]>;
  getUserActivities(userId: string): Promise<ActivityLog[]>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<boolean>;

  // Schedule operations
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | undefined>;
  getSchedulesByGroup(groupId: string): Promise<Schedule[]>;
  getSchedulesByProfessor(professorId: string): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, updates: Partial<Schedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: string): Promise<boolean>;

  // Group message operations
  getGroupMessages(groupId: string): Promise<GroupMessage[]>;
  getGroupMessage(id: string): Promise<GroupMessage | undefined>;
  createGroupMessage(message: InsertGroupMessage): Promise<GroupMessage>;
  updateGroupMessage(id: string, updates: Partial<GroupMessage>): Promise<GroupMessage | undefined>;
  deleteGroupMessage(id: string): Promise<boolean>;

  // Message comment operations
  getMessageComments(messageId: string): Promise<MessageComment[]>;
  createMessageComment(comment: InsertMessageComment): Promise<MessageComment>;
  deleteMessageComment(id: string): Promise<boolean>;

  // Message like operations
  getMessageLikes(messageId: string): Promise<MessageLike[]>;
  createMessageLike(like: InsertMessageLike): Promise<MessageLike>;
  deleteMessageLike(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private groups: Map<string, Group>;
  private subjects: Map<string, Subject>;
  private materials: Map<string, Material>;
  private grades: Map<string, Grade>;
  private activityLogs: Map<string, ActivityLog>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.groups = new Map();
    this.subjects = new Map();
    this.materials = new Map();
    this.grades = new Map();
    this.activityLogs = new Map();
    this.notifications = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => 
      a.firstName.localeCompare(b.firstName)
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = uuidv4();
    const now = new Date();
    const user: User = {
      id,
      ...insertUser,
      createdAt: now,
      updatedAt: now,
      isActive: insertUser.isActive ?? true,
      mustChangePassword: insertUser.mustChangePassword ?? true,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Group operations
  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getGroup(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const id = uuidv4();
    const now = new Date();
    const group: Group = {
      id,
      ...insertGroup,
      description: insertGroup.description ?? null,
      isActive: insertGroup.isActive ?? true,
      createdBy: insertGroup.createdBy ?? null,
      createdAt: now,
    };
    this.groups.set(id, group);
    return group;
  }

  async updateGroup(id: string, updates: Partial<Group>): Promise<Group | undefined> {
    const group = this.groups.get(id);
    if (!group) return undefined;

    const updatedGroup = { ...group, ...updates };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<boolean> {
    return this.groups.delete(id);
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = uuidv4();
    const now = new Date();
    const subject: Subject = {
      id,
      ...insertSubject,
      createdAt: now,
    };
    this.subjects.set(id, subject);
    return subject;
  }

  // Material operations
  async getMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getMaterial(id: string): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = uuidv4();
    const now = new Date();
    const material: Material = {
      id,
      ...insertMaterial,
      createdAt: now,
    };
    this.materials.set(id, material);
    return material;
  }

  async updateMaterial(id: string, updates: Partial<Material>): Promise<Material | undefined> {
    const material = this.materials.get(id);
    if (!material) return undefined;

    const updatedMaterial = { ...material, ...updates };
    this.materials.set(id, updatedMaterial);
    return updatedMaterial;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    return this.materials.delete(id);
  }

  // Grade operations
  async getGrades(): Promise<Grade[]> {
    return Array.from(this.grades.values()).sort((a, b) => 
      b.gradedAt.getTime() - a.gradedAt.getTime()
    );
  }

  async getGrade(id: string): Promise<Grade | undefined> {
    return this.grades.get(id);
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const id = uuidv4();
    const now = new Date();
    const grade: Grade = {
      id,
      ...insertGrade,
      gradedAt: now,
      createdAt: now,
    };
    this.grades.set(id, grade);
    return grade;
  }

  async updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined> {
    const grade = this.grades.get(id);
    if (!grade) return undefined;

    const updatedGrade = { ...grade, ...updates };
    this.grades.set(id, updatedGrade);
    return updatedGrade;
  }

  async deleteGrade(id: string): Promise<boolean> {
    return this.grades.delete(id);
  }

  // Activity log operations
  async logActivity(insertActivity: InsertActivityLog): Promise<ActivityLog> {
    const id = uuidv4();
    const now = new Date();
    const activity: ActivityLog = {
      id,
      ...insertActivity,
      createdAt: now,
    };
    this.activityLogs.set(id, activity);
    return activity;
  }

  async getActivities(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getUserActivities(userId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Notification operations
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = uuidv4();
    const now = new Date();
    const notification: Notification = {
      id,
      ...insertNotification,
      createdAt: now,
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;

    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return true;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups).orderBy(desc(groups.createdAt));
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group || undefined;
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const [group] = await db.insert(groups).values(insertGroup).returning();
    return group;
  }

  async updateGroup(id: string, updates: Partial<Group>): Promise<Group | undefined> {
    const [group] = await db
      .update(groups)
      .set(updates)
      .where(eq(groups.id, id))
      .returning();
    return group || undefined;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const result = await db.delete(groups).where(eq(groups.id, id));
    return result.rowCount > 0;
  }

  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects).orderBy(desc(subjects.createdAt));
  }

  async getSubject(id: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || undefined;
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const [subject] = await db.insert(subjects).values(insertSubject).returning();
    return subject;
  }

  async getMaterials(): Promise<Material[]> {
    return await db.select().from(materials).orderBy(desc(materials.createdAt));
  }

  async getMaterial(id: string): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id));
    return material || undefined;
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const [material] = await db.insert(materials).values(insertMaterial).returning();
    return material;
  }

  async updateMaterial(id: string, updates: Partial<Material>): Promise<Material | undefined> {
    const [material] = await db
      .update(materials)
      .set(updates)
      .where(eq(materials.id, id))
      .returning();
    return material || undefined;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const result = await db.delete(materials).where(eq(materials.id, id));
    return result.rowCount > 0;
  }

  async getGrades(): Promise<Grade[]> {
    return await db.select().from(grades).orderBy(desc(grades.createdAt));
  }

  async getGrade(id: string): Promise<Grade | undefined> {
    const [grade] = await db.select().from(grades).where(eq(grades.id, id));
    return grade || undefined;
  }

  async createGrade(insertGrade: InsertGrade): Promise<Grade> {
    const [grade] = await db.insert(grades).values(insertGrade).returning();
    return grade;
  }

  async updateGrade(id: string, updates: Partial<Grade>): Promise<Grade | undefined> {
    const [grade] = await db
      .update(grades)
      .set(updates)
      .where(eq(grades.id, id))
      .returning();
    return grade || undefined;
  }

  async deleteGrade(id: string): Promise<boolean> {
    const result = await db.delete(grades).where(eq(grades.id, id));
    return result.rowCount > 0;
  }

  async logActivity(insertActivity: InsertActivityLog): Promise<ActivityLog> {
    const [activity] = await db.insert(activityLogs).values(insertActivity).returning();
    return activity;
  }

  async getActivities(): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async getUserActivities(userId: string): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
    return result.rowCount > 0;
  }

  // Schedule operations
  async getSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules).orderBy(schedules.dayOfWeek, schedules.startTime);
  }

  async getSchedule(id: string): Promise<Schedule | undefined> {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule || undefined;
  }

  async getSchedulesByGroup(groupId: string): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(eq(schedules.groupId, groupId))
      .orderBy(schedules.dayOfWeek, schedules.startTime);
  }

  async getSchedulesByProfessor(professorId: string): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(eq(schedules.professorId, professorId))
      .orderBy(schedules.dayOfWeek, schedules.startTime);
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const [schedule] = await db.insert(schedules).values(insertSchedule).returning();
    return schedule;
  }

  async updateSchedule(id: string, updates: Partial<Schedule>): Promise<Schedule | undefined> {
    const [schedule] = await db
      .update(schedules)
      .set(updates)
      .where(eq(schedules.id, id))
      .returning();
    return schedule || undefined;
  }

  async deleteSchedule(id: string): Promise<boolean> {
    const result = await db.delete(schedules).where(eq(schedules.id, id));
    return result.rowCount > 0;
  }

  // Group message operations
  async getGroupMessages(groupId: string): Promise<GroupMessage[]> {
    return await db
      .select()
      .from(groupMessages)
      .where(eq(groupMessages.groupId, groupId))
      .orderBy(desc(groupMessages.createdAt));
  }

  async getGroupMessage(id: string): Promise<GroupMessage | undefined> {
    const [message] = await db.select().from(groupMessages).where(eq(groupMessages.id, id));
    return message || undefined;
  }

  async createGroupMessage(insertMessage: InsertGroupMessage): Promise<GroupMessage> {
    const [message] = await db.insert(groupMessages).values(insertMessage).returning();
    return message;
  }

  async updateGroupMessage(id: string, updates: Partial<GroupMessage>): Promise<GroupMessage | undefined> {
    const [message] = await db
      .update(groupMessages)
      .set(updates)
      .where(eq(groupMessages.id, id))
      .returning();
    return message || undefined;
  }

  async deleteGroupMessage(id: string): Promise<boolean> {
    const result = await db.delete(groupMessages).where(eq(groupMessages.id, id));
    return result.rowCount > 0;
  }

  // Message comment operations
  async getMessageComments(messageId: string): Promise<MessageComment[]> {
    return await db
      .select()
      .from(messageComments)
      .where(eq(messageComments.messageId, messageId))
      .orderBy(desc(messageComments.createdAt));
  }

  async createMessageComment(insertComment: InsertMessageComment): Promise<MessageComment> {
    const [comment] = await db.insert(messageComments).values(insertComment).returning();
    return comment;
  }

  async deleteMessageComment(id: string): Promise<boolean> {
    const result = await db.delete(messageComments).where(eq(messageComments.id, id));
    return result.rowCount > 0;
  }

  // Message like operations
  async getMessageLikes(messageId: string): Promise<MessageLike[]> {
    return await db
      .select()
      .from(messageLikes)
      .where(eq(messageLikes.messageId, messageId))
      .orderBy(desc(messageLikes.createdAt));
  }

  async createMessageLike(insertLike: InsertMessageLike): Promise<MessageLike> {
    const [like] = await db.insert(messageLikes).values(insertLike).returning();
    return like;
  }

  async deleteMessageLike(id: string): Promise<boolean> {
    const result = await db.delete(messageLikes).where(eq(messageLikes.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
