import { 
  users, groups, subjects, materials, grades, activityLogs, notifications,
  type User, type InsertUser, type Group, type InsertGroup, 
  type Subject, type InsertSubject, type Material, type InsertMaterial,
  type Grade, type InsertGrade, type ActivityLog, type InsertActivityLog,
  type Notification, type InsertNotification
} from "@shared/schema";
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

export const storage = new MemStorage();
