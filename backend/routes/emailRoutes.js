import express from 'express';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import EmailTemplate from '../models/EmailTemplate.js';
import { sendEmail } from '../utils/mailers.js'; // ✅ use shared mailer
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ----------------------
// EMAIL TEMPLATE ROUTES
// ----------------------

// GET ALL EMAIL TEMPLATES
router.get('/templates', authenticateAdmin, async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ category: 1, name: 1 });
    res.json(templates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({ error: error.message });
  }
});

// CREATE EMAIL TEMPLATE
router.post('/templates', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, subject, content, variables, isActive } = req.body;
    const template = new EmailTemplate({
      name,
      category,
      subject,
      content,
      variables: variables || [],
      isActive: isActive !== false
    });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating email template:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE EMAIL TEMPLATE
router.put('/templates/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, category, subject, content, variables, isActive } = req.body;
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        subject,
        content,
        variables: variables || [],
        isActive: isActive !== false,
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error updating email template:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE EMAIL TEMPLATE
router.delete('/templates/:id', authenticateAdmin, async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting email template:', error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// EMAIL SENDING ROUTES
// ----------------------

router.post('/send', authenticateAdmin, async (req, res) => {
  try {
    const { templateName, recipientEmail, variables } = req.body;
    const template = await EmailTemplate.findOne({ name: templateName, isActive: true });
    if (!template) {
      return res.status(404).json({ error: 'Template not found or inactive' });
    }

    let subject = template.subject;
    let content = template.content;

    if (variables) {
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, variables[key] || '');
        content = content.replace(regex, variables[key] || '');
      });
    }

    const result = await sendEmail(recipientEmail, subject, content);
    if (result.success) res.json({ message: 'Email sent successfully' });
    else res.status(500).json({ error: result.error });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
