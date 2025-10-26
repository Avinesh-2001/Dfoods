import express from 'express';
import Contact from '../models/Contact.js';
import { body, validationResult } from 'express-validator';
import { authenticateAdmin } from '../middlewares/adminAuth.js';
import { sendContactNotificationToAdmin, sendContactAcknowledgmentToUser } from '../config/emailConfig.js';

const router = express.Router();

// Submit contact form (public)
router.post(
  '/submit',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;

    try {
      const contact = new Contact({
        name,
        email,
        phone: phone || '',
        message
      });

      await contact.save();
      console.log('✅ Contact form saved to database:', { name, email });

      // Send emails asynchronously (don't block response)
      const contactData = { name, email, phone: phone || '', message };
      
      // Send email to admin
      sendContactNotificationToAdmin(contactData)
        .then(() => console.log('✅ Admin notification email sent'))
        .catch((err) => console.error('❌ Failed to send admin email:', err.message));
      
      // Send acknowledgment email to user
      sendContactAcknowledgmentToUser(contactData)
        .then(() => console.log('✅ User acknowledgment email sent'))
        .catch((err) => console.error('❌ Failed to send user email:', err.message));

      res.status(201).json({
        message: 'Thank you for contacting us! You will receive a confirmation email shortly.',
        success: true
      });
    } catch (error) {
      console.error('❌ Contact form error:', error);
      res.status(500).json({ 
        message: 'Failed to submit contact form. Please try again.',
        error: error.message 
      });
    }
  }
);

// Get all contact submissions (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log('Fetched contacts:', contacts.length);
    
    res.json({
      contacts,
      count: contacts.length
    });
  } catch (error) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch contacts',
      error: error.message 
    });
  }
});

// Update contact status (admin only)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  const { status } = req.body;
  
  if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ 
      message: 'Status updated successfully',
      contact 
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ 
      message: 'Failed to update contact',
      error: error.message 
    });
  }
});

// Delete contact (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ 
      message: 'Failed to delete contact',
      error: error.message 
    });
  }
});

export default router;

