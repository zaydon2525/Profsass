import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import session from "express-session";
import { storage } from "./storage";
import { 
  loginSchema, 
  createUserSchema, 
  insertGroupSchema, 
  insertMaterialSchema, 
  insertGradeSchema,
  changePasswordSchema,
  insertScheduleSchema,
  insertSubjectSchema
} from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };

  const requireRole = (roles: string[]) => {
    return async (req: any, res: any, next: any) => {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      req.user = user;
      next();
    };
  };

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is disabled' });
      }

      req.session.userId = user.id;
      
      // Log activity
      await storage.logActivity({
        userId: user.id,
        action: 'login',
        entityType: 'user',
        entityId: user.id,
        details: { email, loginTime: new Date().toISOString() },
      });

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: 'Invalid request' });
    }
  });

  app.post('/api/auth/logout', requireAuth, async (req, res) => {
    const userId = req.session.userId;
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      
      // Log activity
      if (userId) {
        storage.logActivity({
          userId,
          action: 'logout',
          entityType: 'user',
          entityId: userId,
          details: { logoutTime: new Date().toISOString() },
        });
      }
      
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/auth/change-password', requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      
      const user = await storage.getUser(req.session.userId!);
      if (!user || !user.password) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { 
        password: hashedPassword, 
        mustChangePassword: false 
      });

      // Log activity
      await storage.logActivity({
        userId: user.id,
        action: 'change_password',
        entityType: 'user',
        entityId: user.id,
        details: { changedAt: new Date().toISOString() },
      });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // User routes
  app.get('/api/users', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/users', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const currentUser = await storage.getUser(req.session.userId!);
      
      // Check role permissions
      if (currentUser?.role === 'professor' && !['student', 'parent'].includes(userData.role)) {
        return res.status(403).json({ message: 'Professors can only create students and parents' });
      }

      // Check if user exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        createdBy: req.session.userId!,
      });

      // Log activity
      await storage.logActivity({
        userId: req.session.userId!,
        action: 'create_user',
        entityType: 'user',
        entityId: user.id,
        details: { 
          email: userData.email, 
          role: userData.role,
          name: `${userData.firstName} ${userData.lastName}`
        },
      });

      res.status(201).json({ ...user, password: undefined });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/users/:id', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'update_user',
        entityType: 'user',
        entityId: id,
        details: { updates },
      });

      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/users/:id', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'delete_user',
        entityType: 'user',
        entityId: id,
        details: { deletedAt: new Date().toISOString() },
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Group routes
  app.get('/api/groups', requireAuth, async (req, res) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (error) {
      console.error('Get groups error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/groups', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const groupData = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup({
        ...groupData,
        createdBy: req.session.userId,
      });

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'create_group',
        entityType: 'group',
        entityId: group.id,
        details: { 
          name: groupData.name,
          academicYear: groupData.academicYear
        },
      });

      res.status(201).json(group);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid group data', errors: error.errors });
      }
      console.error('Create group error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/groups/:id', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteGroup(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Group not found' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'delete_group',
        entityType: 'group',
        entityId: id,
        details: { deletedAt: new Date().toISOString() },
      });

      res.json({ message: 'Group deleted successfully' });
    } catch (error) {
      console.error('Delete group error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Material routes
  app.get('/api/materials', requireAuth, async (req, res) => {
    try {
      const materials = await storage.getMaterials();
      res.json(materials);
    } catch (error) {
      console.error('Get materials error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/materials', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const materialData = insertMaterialSchema.parse(req.body);
      const material = await storage.createMaterial({
        ...materialData,
        uploadedBy: req.session.userId,
      });

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'upload_material',
        entityType: 'material',
        entityId: material.id,
        details: { 
          title: materialData.title,
          fileType: materialData.fileType,
          fileSize: materialData.fileSize
        },
      });

      res.status(201).json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid material data', errors: error.errors });
      }
      console.error('Create material error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/materials/:id', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteMaterial(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Material not found' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'delete_material',
        entityType: 'material',
        entityId: id,
        details: { deletedAt: new Date().toISOString() },
      });

      res.json({ message: 'Material deleted successfully' });
    } catch (error) {
      console.error('Delete material error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Grade routes
  app.get('/api/grades', requireAuth, async (req, res) => {
    try {
      const grades = await storage.getGrades();
      res.json(grades);
    } catch (error) {
      console.error('Get grades error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/grades', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const gradeData = insertGradeSchema.parse(req.body);
      const grade = await storage.createGrade({
        ...gradeData,
        gradedBy: req.session.userId,
      });

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'create_grade',
        entityType: 'grade',
        entityId: grade.id,
        details: { 
          title: gradeData.title, 
          value: gradeData.gradeValue,
          maxValue: gradeData.maxValue,
          gradeType: gradeData.gradeType
        },
      });

      res.status(201).json(grade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid grade data', errors: error.errors });
      }
      console.error('Create grade error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/grades/:id', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteGrade(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Grade not found' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'delete_grade',
        entityType: 'grade',
        entityId: id,
        details: { deletedAt: new Date().toISOString() },
      });

      res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
      console.error('Delete grade error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Activity logs
  app.get('/api/activities', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Notifications
  app.get('/api/notifications', requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.session.userId);
      res.json(notifications);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Schedule routes
  app.get('/api/schedules', requireAuth, async (req, res) => {
    try {
      const { groupId, professorId } = req.query;
      let schedules;
      
      if (groupId) {
        schedules = await storage.getSchedulesByGroup(groupId as string);
      } else if (professorId) {
        schedules = await storage.getSchedulesByProfessor(professorId as string);
      } else {
        schedules = await storage.getSchedules();
      }
      
      res.json(schedules);
    } catch (error) {
      console.error('Get schedules error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/schedules', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const scheduleData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(scheduleData);

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'create_schedule',
        entityType: 'schedule',
        entityId: schedule.id,
        details: { 
          dayOfWeek: scheduleData.dayOfWeek,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          groupId: scheduleData.groupId,
          subjectId: scheduleData.subjectId
        },
      });

      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid schedule data', errors: error.errors });
      }
      console.error('Create schedule error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/schedules/:id', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const schedule = await storage.updateSchedule(id, updates);
      if (!schedule) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'update_schedule',
        entityType: 'schedule',
        entityId: id,
        details: { updates },
      });

      res.json(schedule);
    } catch (error) {
      console.error('Update schedule error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/schedules/:id', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteSchedule(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Schedule not found' });
      }

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'delete_schedule',
        entityType: 'schedule',
        entityId: id,
        details: { deletedAt: new Date().toISOString() },
      });

      res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      console.error('Delete schedule error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Subject routes (needed for schedule creation)
  app.get('/api/subjects', requireAuth, async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      console.error('Get subjects error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/subjects', requireAuth, requireRole(['admin', 'professor']), async (req, res) => {
    try {
      const subjectData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(subjectData);

      // Log activity
      await storage.logActivity({
        userId: req.session.userId,
        action: 'create_subject',
        entityType: 'subject',
        entityId: subject.id,
        details: { 
          name: subjectData.name,
          code: subjectData.code
        },
      });

      res.status(201).json(subject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid subject data', errors: error.errors });
      }
      console.error('Create subject error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Initialize default admin user
  const initializeDefaultAdmin = async () => {
    try {
      const existingAdmin = await storage.getUserByEmail('admin@ecole.com');
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin23', 10);
        await storage.createUser({
          email: 'admin@ecole.com',
          firstName: 'Admin',
          lastName: 'System',
          password: hashedPassword,
          role: 'admin',
          isActive: true,
          mustChangePassword: false,
        });
        console.log('✅ Default admin user created: admin@ecole.com / admin23');
      }
    } catch (error) {
      console.error('❌ Failed to create default admin user:', error);
    }
  };

  // Initialize default data
  const initializeDefaultData = async () => {
    try {
      // Create default subjects
      const subjects = [
        { name: 'Mathématiques', code: 'MATH', description: 'Cours de mathématiques', color: '#3b82f6' },
        { name: 'Français', code: 'FR', description: 'Cours de français', color: '#ef4444' },
        { name: 'Histoire', code: 'HIST', description: 'Cours d\'histoire', color: '#f59e0b' },
        { name: 'Sciences', code: 'SCI', description: 'Cours de sciences', color: '#10b981' },
        { name: 'Anglais', code: 'EN', description: 'Cours d\'anglais', color: '#8b5cf6' },
        { name: 'Éducation Physique', code: 'EP', description: 'Cours d\'éducation physique', color: '#f97316' },
      ];

      for (const subject of subjects) {
        const existing = await storage.getSubjects();
        if (!existing.find(s => s.code === subject.code)) {
          await storage.createSubject(subject);
        }
      }

      console.log('✅ Default subjects initialized');
    } catch (error) {
      console.error('❌ Failed to initialize default data:', error);
    }
  };

  // Initialize on startup
  await initializeDefaultAdmin();
  await initializeDefaultData();

  const httpServer = createServer(app);
  return httpServer;
}
