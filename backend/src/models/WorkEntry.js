const prisma = require('../config/database');

class WorkEntry {
  static async findAll(userId) {
    return await prisma.workEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(id, userId) {
    return await prisma.workEntry.findFirst({
      where: { id, userId }
    });
  }

  static async create(workEntryData) {
    return await prisma.workEntry.create({
      data: workEntryData
    });
  }

  static async update(id, userId, workEntryData) {
    return await prisma.workEntry.updateMany({
      where: { id, userId },
      data: workEntryData
    });
  }

  static async delete(id, userId) {
    return await prisma.workEntry.deleteMany({
      where: { id, userId }
    });
  }

  static async getSummary(userId, startDate, endDate) {
    return await prisma.workEntry.groupBy({
      by: ['userId'],
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        duration: true
      },
      _count: true
    });
  }
}

module.exports = WorkEntry;