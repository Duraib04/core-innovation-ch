# Custom Project Request - AI Chatbot Setup

This feature allows users to request custom projects through an empathetic AI chatbot that asks detailed questions, generates a professional PDF proposal, and sends it via email.

## 🎯 How It Works

### User Experience:
1. User clicks "Request Custom Project" button (appears in Hero, Products, and Contact sections)
2. AI chatbot greets them and starts asking questions
3. Empathetic conversation flow to understand their needs:
   - Personal information (name, email, phone)
   - Project type and purpose
   - Target audience
   - Detailed description and features
   - Inspiration and references
   - Challenges and concerns
   - Budget and timeline
   - Additional requirements

4. Once all questions are answered:
   - Professional PDF proposal is generated
   - PDF is sent to your email (itsdurai4@gmail.com)
   - Confirmation email sent to customer
   - PDF auto-downloads for customer

## 📋 Conversation Flow (12 Questions)

The chatbot uses empathetic language and asks:

1. **Name** - "What's your name?"
2. **Email** - Validated format
3. **Phone** - 10-digit validation
4. **Project Type** - IoT, Web, Mobile, Hardware+Software, Other
5. **Purpose** - "What problem does this solve? What inspired you?"
6. **Target Audience** - "Who will be using this?"
7. **Description** - "Describe your project in detail"
8. **Features** - Comma-separated list of must-have features
9. **Inspiration** - Reference websites, apps, or ideas
10. **Challenges** - Concerns or technical constraints
11. **Budget** - Range options
12. **Timeline** - When they need it completed

## 🛠️ Setup Instructions

### Step 1: EmailJS Configuration

Just like the order form, you need to set up EmailJS:

1. Use your existing EmailJS account
2. Create 2 new email templates:

#### Template 1: Project Request Notification (For You)
```
Subject: New Custom Project Request - {{client_name}}

New Project Request Details:
---------------------------
Client: {{client_name}}
Email: {{client_email}}
Phone: {{client_phone}}

Project Type: {{project_type}}
Budget: {{budget}}
Timeline: {{timeline}}

A detailed PDF proposal is attached.
Please review and contact the client within 24 hours.

---
Core Innovation - Project Management System
```

#### Template 2: Client Confirmation
```
Subject: Your Custom Project Request - Received!

Dear {{client_name}},

Thank you for your interest in creating a custom {{project_type}} with Core Innovation!

We have received your detailed project proposal and our team is reviewing it.

Next Steps:
• We will review your requirements within 24 hours
• You'll receive a detailed quote and project timeline
• We'll schedule a call to discuss the project in detail

Your project proposal PDF has been sent to you and our team.

Best regards,
Durai
Core Innovation
Email: itsdurai4@gmail.com
Phone: +91 6369704741
```

### Step 2: Update Code

Open `app/custom-project/page.tsx` and replace:

```typescript
// Line ~463
emailjs.init('YOUR_PUBLIC_KEY')

// Line ~467-473
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_PROJECT_TEMPLATE_ID',  // Template 1 ID
  {
    to_email: 'itsdurai4@gmail.com',
    client_name: data.name,
    client_email: data.email,
    client_phone: data.phone,
    project_type: data.projectType,
    budget: data.budget,
    timeline: data.timeline,
    pdf_attachment: pdfBase64,
  }
)

// Line ~476-482
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_CLIENT_CONFIRMATION_TEMPLATE_ID',  // Template 2 ID
  {
    to_email: data.email,
    client_name: data.name,
    project_type: data.projectType,
  }
)
```

## 📄 Generated PDF Contents

The PDF includes:
- **Header**: Core Innovation branding
- **Client Information**: Name, email, phone
- **Project Overview**: Type, budget, timeline
- **Purpose & Motivation**: Why they want it
- **Target Audience**: Who will use it
- **Detailed Description**: How it should work
- **Key Features**: Numbered list of must-haves
- **Inspiration & References**: What inspired them
- **Potential Challenges**: Their concerns
- **Additional Notes**: Extra requirements
- **Footer**: Thank you message with contact info

## 🎨 Design Features

- **Empathetic Tone**: Friendly, conversational questions
- **Real-time Chat**: Instant message delivery
- **Typing Indicator**: Shows bot is "thinking"
- **Smooth Animations**: Messages slide in
- **Mobile Responsive**: Works on all devices
- **Input Validation**: Email and phone validation
- **Progress Tracking**: Users see their answers
- **Professional PDF**: Multi-page, well-formatted document

## 🔗 Access Points

Users can access the custom project page from:

1. **Hero Section**: Green "🎯 Request Custom Project" button
2. **Products Section**: Large banner above products
3. **Contact Section**: Green card with AI assistant mention
4. **Direct URL**: `/custom-project`

## ✨ Key Benefits

✅ **Empathetic Approach**: Questions designed to understand user needs deeply
✅ **Comprehensive Data**: Collects all necessary project information
✅ **Professional Output**: Well-formatted PDF proposal
✅ **Automated Workflow**: No manual data entry needed
✅ **Instant Communication**: Both parties get copies immediately
✅ **User-Friendly**: Simple chat interface, no forms to fill
✅ **Validation**: Ensures quality data collection

## 🚀 Testing

To test the chatbot:

1. Run `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Request Custom Project" button
4. Answer all questions
5. Check that PDF downloads
6. Verify console for any errors

## 💡 Tips for Best Results

- Use the EXACT EmailJS credentials (Service ID, Template IDs, Public Key)
- Test with a real email address to verify delivery
- Check spam folder if emails don't arrive
- Ensure PDF attachments are enabled in EmailJS (may need premium plan for attachments)
- If attachments don't work, the PDF still downloads for the user

## 📊 Analytics Ideas (Future Enhancement)

You could track:
- Number of project requests
- Most common project types
- Average budget ranges
- Response times
- Conversion rates

---

This feature transforms how you collect project requirements - from boring forms to engaging conversations! 🎯✨
