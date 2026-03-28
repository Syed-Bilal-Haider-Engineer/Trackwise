const prisma = require('../config/database');

class User {
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  static async create(userData) {
    return await prisma.user.create({
      data: userData
    });
  }

  static async update(id, userData) {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
  }

  static async delete(id) {
    return await prisma.user.delete({
      where: { id }
    });
  }
}

module.exports = User;