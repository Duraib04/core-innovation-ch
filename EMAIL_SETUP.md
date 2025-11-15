# Email Setup Guide for Order Form

This guide will help you set up EmailJS to send order confirmation emails automatically.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended):
   - Select **Gmail**
   - Click **Connect Account**
   - Sign in with your Gmail (itsdurai4@gmail.com)
   - Allow EmailJS permissions
4. Copy your **Service ID** (e.g., `service_abc1234`)

## Step 3: Create Email Templates

### Template 1: For Your Email (Owner)

1. Go to **Email Templates** → **Create New Template**
2. **Template Name**: `Order Notification - Owner`
3. **Template Content**:

```
Subject: New Order Received - {{product_name}}

Order Details:
--------------
Order Number: {{order_number}}
Product: {{product_name}}
Price: {{product_price}}
Quantity: {{quantity}}

Customer Information:
---------------------
Name: {{customer_name}}
Email: {{customer_email}}
Phone: {{phone}}
Address: {{address}}

Please process this order at your earliest convenience.

PDF attachment contains full order details.
```

4. Copy the **Template ID** (e.g., `template_xyz5678`)

### Template 2: For Customer Email

1. Create another template: `Order Confirmation - Customer`
2. **Template Content**:

```
Subject: Order Confirmation - {{product_name}}

Dear {{customer_name}},

Thank you for your order!

Order Details:
--------------
Order Number: {{order_number}}
Product: {{product_name}}
Price: {{product_price}}
Quantity: {{quantity}}

Delivery Address:
-----------------
{{address}}

We have received your order and will contact you shortly to confirm delivery details.

Your order invoice is attached as PDF.

Best regards,
Core Innovation Team
Email: itsdurai4@gmail.com
Phone: +91 6369704741
```

3. Copy this **Template ID** too

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find **Public Key** (e.g., `abc123XYZ456def789`)
3. Copy this key

## Step 5: Update Your Code

Open `components/Products.tsx` and replace the placeholders:

```typescript
// Line ~105: Initialize EmailJS
emailjs.init('YOUR_PUBLIC_KEY') // Replace with your Public Key

// Line ~120: Send to owner
await emailjs.send(
  'YOUR_SERVICE_ID',     // Replace with your Service ID
  'YOUR_TEMPLATE_ID',    // Replace with Owner Template ID
  emailParams
)

// Line ~126: Send to customer  
await emailjs.send(
  'YOUR_SERVICE_ID',              // Same Service ID
  'YOUR_CUSTOMER_TEMPLATE_ID',    // Replace with Customer Template ID
  {
    ...emailParams,
    to_email: formData.email,
  }
)
```

### Example (with real IDs):
```typescript
emailjs.init('abc123XYZ456def789')

await emailjs.send(
  'service_abc1234',
  'template_xyz5678',
  emailParams
)

await emailjs.send(
  'service_abc1234',
  'template_customer_123',
  {
    ...emailParams,
    to_email: formData.email,
  }
)
```

## Step 6: Test the System

1. Build and run your project: `npm run dev`
2. Go to Products section
3. Click "Add to Cart" on any product
4. Fill in the form with test data
5. Click "Place Order"
6. Check:
   - PDF downloads to customer's computer ✓
   - Email sent to itsdurai4@gmail.com ✓
   - Email sent to customer's email ✓

## Features Included

✅ **PDF Generation**: Professional order slip with company branding
✅ **Dual Email**: Sends to both you and customer
✅ **Auto Download**: Customer gets PDF immediately
✅ **Order Number**: Unique order ID generated
✅ **Full Details**: Product, customer info, delivery address
✅ **Responsive**: Loading state while processing

## Free Tier Limits

EmailJS free plan includes:
- 200 emails per month
- Unlimited email templates
- Basic analytics

Perfect for starting your business!

## Troubleshooting

**Problem**: Email not sending
- Check your EmailJS credentials are correct
- Verify email service is connected
- Check browser console for errors

**Problem**: PDF not generating
- Check all form fields are filled
- Verify jsPDF is installed: `npm list jspdf`

**Problem**: Wrong email received
- Double-check template IDs match
- Verify `to_email` parameter in code

## Security Note

Your EmailJS public key is safe to expose in frontend code. It only allows sending emails through your configured templates, not reading or accessing your email account.

---

Need help? Contact Durai at itsdurai4@gmail.com
