import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Account / User Emails',
      'Discount / Marketing Emails', 
      'Checkout / Order Emails',
      'Shipping Emails',
      'Payment Emails',
      'Return Emails'
    ]
  },
  subject: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  variables: [{ 
    type: String 
  }], // Available variables like {{user_name}}, {{order_id}}, etc.
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
emailTemplateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
export default EmailTemplate;





