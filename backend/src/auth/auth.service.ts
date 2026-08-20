import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { usersStore, seedDefaultTasks, User } from '../memory-store';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string) {
    if (process.env.VERCEL) {
      let user = Array.from(usersStore.values()).find((u) => u.email === email);
      if (!user) {
        user = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          isGuest: false,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
          createdAt: new Date(),
        };
        usersStore.set(user.id, user);
      }
      const payload = { sub: user.id, email: user.email, isGuest: user.isGuest, name: user.name };
      return { user, accessToken: this.jwtService.sign(payload) };
    }

    // Local standard execution
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          isGuest: false,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        },
      });
    }

    const payload = { sub: user.id, email: user.email, isGuest: user.isGuest, name: user.name };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async loginAsGuest() {
    if (process.env.VERCEL) {
      const randomSeed = Math.floor(100000 + Math.random() * 900000);
      const guestEmail = `guest_${randomSeed}@ablespace-guest.com`;
      const user: User = {
        id: `guest-${randomSeed}`,
        email: guestEmail,
        name: `Guest SLP`,
        isGuest: true,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=guest_${randomSeed}`,
        createdAt: new Date(),
      };
      usersStore.set(user.id, user);
      seedDefaultTasks(user.id);

      const payload = { sub: user.id, email: user.email, isGuest: true, name: user.name };
      return { user, accessToken: this.jwtService.sign(payload) };
    }

    // Local standard execution
    const randomSeed = Math.floor(100000 + Math.random() * 900000);
    const guestEmail = `guest_${randomSeed}@ablespace-guest.com`;
    
    const user = await this.prisma.user.create({
      data: {
        email: guestEmail,
        name: `Guest SLP`,
        isGuest: true,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=guest_${randomSeed}`,
      },
    });

    await this.prisma.task.createMany({
      data: [
        {
          title: "Write IEP goal report for Alex Smith",
          description: "Draft progress summary based on speech production accuracy data.",
          status: "TODO",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 86400000 * 2),
          progress: 0,
          assigneeId: user.id,
        },
        {
          title: "Prepare target materials for group articulation session",
          description: "Print /s/ blend word lists and flashcards.",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 86400000 * 1),
          progress: 50,
          assigneeId: user.id,
        },
        {
          title: "Sync caseload data with district repository",
          description: "Completed import of student roster from district database.",
          status: "DONE",
          priority: "LOW",
          dueDate: new Date(),
          progress: 100,
          assigneeId: user.id,
        }
      ]
    });

    const payload = { sub: user.id, email: user.email, isGuest: true, name: user.name };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUserById(id: string) {
    if (process.env.VERCEL) {
      return usersStore.get(id);
    }
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
