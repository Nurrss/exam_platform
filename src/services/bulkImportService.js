const csv = require('csv-parser');
const fs = require('fs');
const prisma = require('../config/prismaClient');
const { logger } = require('../config/logger');

class BulkImportService {
  /**
   * Import questions from CSV file
   * CSV Format: text,type,options,correct,points
   * Example: "What is 2+2?","MULTIPLE_CHOICE","[\"2\",\"3\",\"4\",\"5\"]","4",1
   *
   * @param {String} filePath - Path to CSV file
   * @param {Number} examId - Exam ID to import questions into
   * @param {Number} userId - User performing the import
   * @returns {Object} Import results
   */
  async importFromCSV(filePath, examId, userId) {
    const questions = [];
    const errors = [];
    let lineNumber = 1;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          lineNumber++;
          try {
            // Parse and validate question data
            const question = this.parseCSVRow(row, lineNumber);
            questions.push(question);
          } catch (error) {
            errors.push({
              line: lineNumber,
              error: error.message,
              data: row,
            });
          }
        })
        .on('end', async () => {
          try {
            // Verify exam exists and user has access
            await this.verifyExamAccess(examId, userId);

            // Insert questions into database
            const results = await this.bulkCreateQuestions(examId, questions);

            // Clean up uploaded file
            fs.unlinkSync(filePath);

            logger.info('Bulk import completed', {
              examId,
              userId,
              successCount: results.successCount,
              errorCount: errors.length,
            });

            resolve({
              success: true,
              imported: results.successCount,
              failed: errors.length,
              errors: errors.length > 0 ? errors : undefined,
              details: results.details,
            });
          } catch (error) {
            // Clean up file on error
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            reject(error);
          }
        })
        .on('error', (error) => {
          // Clean up file on error
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(error);
        });
    });
  }

  /**
   * Import questions from JSON file
   * JSON Format: Array of question objects
   * [
   *   {
   *     "text": "What is 2+2?",
   *     "type": "MULTIPLE_CHOICE",
   *     "options": ["2", "3", "4", "5"],
   *     "correct": "4",
   *     "points": 1
   *   }
   * ]
   *
   * @param {String} filePath - Path to JSON file
   * @param {Number} examId - Exam ID to import questions into
   * @param {Number} userId - User performing the import
   * @returns {Object} Import results
   */
  async importFromJSON(filePath, examId, userId) {
    try {
      // Read and parse JSON file
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      if (!Array.isArray(data)) {
        throw new Error('JSON файл должен содержать массив вопросов');
      }

      // Verify exam exists and user has access
      await this.verifyExamAccess(examId, userId);

      const questions = [];
      const errors = [];

      // Validate and parse each question
      data.forEach((item, index) => {
        try {
          const question = this.parseJSONQuestion(item, index + 1);
          questions.push(question);
        } catch (error) {
          errors.push({
            index: index + 1,
            error: error.message,
            data: item,
          });
        }
      });

      // Insert questions into database
      const results = await this.bulkCreateQuestions(examId, questions);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      logger.info('Bulk import from JSON completed', {
        examId,
        userId,
        successCount: results.successCount,
        errorCount: errors.length,
      });

      return {
        success: true,
        imported: results.successCount,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined,
        details: results.details,
      };
    } catch (error) {
      // Clean up file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  /**
   * Parse CSV row into question object
   */
  parseCSVRow(row, lineNumber) {
    const { text, type, options, correct, points, imageUrl } = row;

    if (!text || !type) {
      throw new Error('Обязательные поля: text, type');
    }

    const validTypes = ['MULTIPLE_CHOICE', 'TEXT', 'TRUE_FALSE'];
    if (!validTypes.includes(type)) {
      throw new Error(`Недопустимый тип вопроса: ${type}`);
    }

    return {
      text: text.trim(),
      type,
      options: options ? JSON.parse(options) : null,
      correct: correct ? JSON.parse(correct) : null,
      points: points ? parseInt(points) : 1,
      imageUrl: imageUrl || null,
      order: lineNumber - 1, // Use line number as order
    };
  }

  /**
   * Parse JSON question object
   */
  parseJSONQuestion(item, index) {
    const { text, type, options, correct, points, imageUrl } = item;

    if (!text || !type) {
      throw new Error('Обязательные поля: text, type');
    }

    const validTypes = ['MULTIPLE_CHOICE', 'TEXT', 'TRUE_FALSE'];
    if (!validTypes.includes(type)) {
      throw new Error(`Недопустимый тип вопроса: ${type}`);
    }

    return {
      text: text.trim(),
      type,
      options: options || null,
      correct: correct || null,
      points: points || 1,
      imageUrl: imageUrl || null,
      order: index,
    };
  }

  /**
   * Verify exam exists and user has access
   */
  async verifyExamAccess(examId, userId) {
    const exam = await prisma.exam.findUnique({
      where: { id: Number(examId) },
    });

    if (!exam) {
      throw new Error('Экзамен не найден');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== 'ADMIN' && exam.teacherId !== userId) {
      throw new Error('Нет доступа к этому экзамену');
    }

    return exam;
  }

  /**
   * Bulk create questions in database
   */
  async bulkCreateQuestions(examId, questions) {
    const details = [];
    let successCount = 0;

    for (const questionData of questions) {
      try {
        const question = await prisma.question.create({
          data: {
            examId: Number(examId),
            ...questionData,
          },
        });

        details.push({
          success: true,
          questionId: question.id,
          text: question.text.substring(0, 50) + '...',
        });
        successCount++;
      } catch (error) {
        details.push({
          success: false,
          error: error.message,
          text: questionData.text.substring(0, 50) + '...',
        });
      }
    }

    return { successCount, details };
  }
}

module.exports = new BulkImportService();
