const WorkEntry = require('../models/WorkEntry');

class WorkEntryController {
  static async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const workEntries = await WorkEntry.findAll(userId);

      res.json({
        success: true,
        data: workEntries
      });
    } catch (error) {
      console.error('Get work entries error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const workEntry = await WorkEntry.findById(id, userId);
      if (!workEntry) {
        return res.status(404).json({
          success: false,
          error: 'Work entry not found'
        });
      }

      res.json({
        success: true,
        data: workEntry
      });
    } catch (error) {
      console.error('Get work entry error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async create(req, res) {
    try {
      const userId = req.user.userId;
      const { title, description, startTime, endTime, duration } = req.body;

      const workEntry = await WorkEntry.create({
        userId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration
      });

      res.status(201).json({
        success: true,
        data: workEntry
      });
    } catch (error) {
      console.error('Create work entry error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const updateData = req.body;

      if (updateData.startTime) {
        updateData.startTime = new Date(updateData.startTime);
      }
      if (updateData.endTime) {
        updateData.endTime = new Date(updateData.endTime);
      }

      const result = await WorkEntry.update(id, userId, updateData);

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          error: 'Work entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Work entry updated successfully'
      });
    } catch (error) {
      console.error('Update work entry error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const result = await WorkEntry.delete(id, userId);

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          error: 'Work entry not found'
        });
      }

      res.json({
        success: true,
        message: 'Work entry deleted successfully'
      });
    } catch (error) {
      console.error('Delete work entry error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getSummary(req, res) {
    try {
      const userId = req.user.userId;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const end = endDate ? new Date(endDate) : new Date();

      const summary = await WorkEntry.getSummary(userId, start, end);

      res.json({
        success: true,
        data: summary[0] || { _count: 0, _sum: { duration: 0 } }
      });
    } catch (error) {
      console.error('Get summary error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

module.exports = WorkEntryController;