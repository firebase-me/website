# Email Verification with Firebase

Firebase Auth allows you to send and process account management emails for tasks such as resetting passwords, verifying email addresses, and reverting email address changes. This guide covers how to customize these emails, set up custom domains, and use custom email providers.

## Customizing Account Management Emails

### Supported Account Management Tasks

Firebase Auth can send emails for the following tasks:
- Resetting a forgotten password
- Reverting an email address change
- Verifying the user's email address

### Customizing Email Fields

For each email type, you can customize the sender name, sender address, reply-to address, subject line, and message. The following placeholder strings can be used in the subject line and message:

- `%DISPLAY_NAME%`: The recipient's display name
- `%APP_NAME%`: The name of your app (set this in the Public-facing name field on the Settings page)
- `%LINK%`: The URL the recipient must visit to complete the account management task
- `%EMAIL%`: The recipient's email address
- `%NEW_EMAIL%`: The new email address to set as the recipient's primary address (used only in the Email Address Change template)

### Customizing the Action Link URL

To use your own server to handle account management emails, specify the URL to your server's account management page:

1. Click an email type.
2. Click the pencil icon to begin editing the email template.
3. Click "Customize action URL".
4. Specify the URL to your server's account management page. Two parameters, `mode` and `oobCode`, will be appended to the URL when emails are sent. For example: `https://example.com/acctmgmt/__/auth/action?mode=<action>&oobCode=<code>`.

### Customizing the Sender Domain

To specify a sender address with a custom domain:

1. Click an email type.
2. Click the pencil icon to begin editing the email template.
3. Click "Customize domain".
4. Specify the domain you want to use and follow the provided instructions to verify that you own the domain.

## Processing Account Management Emails

### Resetting a Forgotten Password

1. **Send Password Reset Email**:

    Firebase provides built-in methods to send password reset emails.

    ```javascript
    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            console.log('Password reset email sent.');
        })
        .catch((error) => {
            console.error('Error sending password reset email:', error);
        });
    ```

2. **Handling Password Reset**:

    When the user clicks the link in the email, they are directed to your specified action URL with `mode` and `oobCode` parameters. Use these parameters to handle the password reset.

    ```javascript
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    if (mode === 'resetPassword') {
        // Show reset password UI and process the reset
        firebase.auth().confirmPasswordReset(oobCode, newPassword)
            .then(() => {
                console.log('Password reset successfully.');
            })
            .catch((error) => {
                console.error('Error resetting password:', error);
            });
    }
    ```

### Reverting an Email Address Change

1. **Send Email Address Change Reversion Email**:

    Firebase automatically sends an email to the user's new email address when they change their email.

    ```javascript
    firebase.auth().currentUser.updateEmail(newEmail)
        .then(() => {
            console.log('Email address updated.');
        })
        .catch((error) => {
            console.error('Error updating email address:', error);
        });
    ```

2. **Handling Email Address Change Reversion**:

    When the user clicks the link in the reversion email, they are directed to your specified action URL with `mode` and `oobCode` parameters. Use these parameters to revert the email change.

    ```javascript
    if (mode === 'recoverEmail') {
        // Show email recovery UI and process the recovery
        firebase.auth().checkActionCode(oobCode)
            .then((info) => {
                const email = info.data.email;
                return firebase.auth().applyActionCode(oobCode);
            })
            .then(() => {
                console.log('Email address reverted successfully.');
            })
            .catch((error) => {
                console.error('Error reverting email address:', error);
            });
    }
    ```

### Verifying the User's Email Address

1. **Send Email Verification**:

    Firebase provides built-in methods to send email verification.

    ```javascript
    firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
            console.log('Email verification sent.');
        })
        .catch((error) => {
            console.error('Error sending email verification:', error);
        });
    ```

2. **Handling Email Verification**:

    When the user clicks the link in the verification email, they are directed to your specified action URL with `mode` and `oobCode` parameters. Use these parameters to verify the email.

    ```javascript
    if (mode === 'verifyEmail') {
        // Show email verification UI and process the verification
        firebase.auth().applyActionCode(oobCode)
            .then(() => {
                console.log('Email verified successfully.');
            })
            .catch((error) => {
                console.error('Error verifying email:', error);
            });
    }
    ```

## Setting Up a Custom Domain and Email Provider

Using a custom domain for email verification can improve deliverability and branding. Here’s how to set up a custom domain and integrate a custom email provider.

### Suggested Email Providers

Here are some recommended email providers for sending verification emails:
1. **SendGrid**: A popular email service provider that offers a free tier and is easy to integrate with Firebase.
2. **Mailgun**: Another reliable email service provider with a flexible API and robust features.
3. **Amazon SES**: A scalable and cost-effective email service provided by AWS.

### Setting Up a Custom Email Provider

Follow the email provider’s documentation and DNS setup instructions. Here’s an example using SendGrid and Firebase Cloud Functions:

1. **Set Up SendGrid**:

    - Sign up for a SendGrid account.
    - Create an API key in the SendGrid dashboard.
    - Verify your domain in SendGrid.

2. **Create a Cloud Function to Send Verification Emails**:

    ```javascript
    const functions = require('firebase-functions');
    const admin = require('firebase-admin');
    const sgMail = require('@sendgrid/mail');

    admin.initializeApp();
    sgMail.setApiKey('YOUR_SENDGRID_API_KEY'); // Server environment

    exports.sendCustomVerificationEmail = functions.https.onCall(async (data, context) => {
        const oobCode = data.oobCode;
        const email = data.email;
        const displayName = data.displayName;
        const appName = 'Your App Name'; // Replace with your app name
        const actionLink = `https://example.com/acctmgmt/__/auth/action?mode=verifyEmail&oobCode=${oobCode}`;

        const msg = {
            to: email,
            from: 'no-reply@yourdomain.com',
            subject: `Verify your email for ${appName}`,
            text: `Hello ${displayName},\n\nPlease verify your email by clicking the link: ${actionLink}`,
            html: `<strong>Hello ${displayName},</strong><br><br>Please verify your email by clicking the link: <a href="${actionLink}">${actionLink}</a>`
        };

        try {
            await sgMail.send(msg);
            console.log('Verification email sent to:', email);
            return { success: true };
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new functions.https.HttpsError('internal', 'Error sending verification email');
        }
    });
    ```

3. **Customize the Action URL**:

    Ensure the `LINK` in the email points to your custom domain. Update the Firebase Authentication settings to use your custom domain for the action link URL.

### Customizing the Email Template

You can customize the email template to include placeholders that will be replaced with actual values when sending the email.

1. **Create the Email Template**:

    ```html
    <html>
        <body>
            <p>Hello %DISPLAY_NAME%,</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="%LINK%">%LINK%</a>
            <p>If you did not request this, please ignore this email.</p>
        </body>
    </html>
    ```

2. **Send the Customized Email**:

    Modify the Cloud Function to use the template:

    ```javascript
    exports.sendCustomVerificationEmail = functions.https.onCall(async (data, context) => {
        const oobCode = data.oobCode;
        const email = data.email;
        const displayName = data.displayName;
        const appName = 'Your App Name'; // Replace with your app name
        const actionLink = `https://example.com/acctmgmt/__/auth/action?mode=verifyEmail&oobCode=${oobCode}`;

        const msg = {
            to: email,
            from: 'no-reply@yourdomain.com',
            subject: `Verify your email for ${appName}`,
            text: `Hello ${displayName},\n\nPlease verify your email by clicking the link: ${actionLink}`,
            html: `<strong>Hello ${displayName},</strong><br><br>Please verify your email by clicking the link: <a href="${actionLink}">${actionLink}</a>`
        };

        try {
            await sgMail.send(msg);
            console.log('Verification email sent to:', email);
            return { success: true };
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new functions.https.HttpsError('internal', 'Error sending verification email');
        }
    });
    ```

## Domain Validation to Prevent Emails from Going to Spam

To prevent emails from going to spam, validate your domain by setting up SPF, DKIM, and DMARC records.

1. **SPF Record**:

    Add an SPF record to your DNS settings to specify which mail servers are allowed to send emails on behalf of your domain.

    ```
    v=spf1 include:_spf.google.com ~all
    ```

2. **DKIM Record**:

    Configure DKIM to add a digital signature to your emails, verifying that they are from your domain.

    ```
    v=DKIM1; k=rsa; p=your-public-key
    ```

3. **DMARC Record**:

    Add a DMARC record to help email providers determine how to handle emails that fail SPF or DKIM checks.

    ```
    v=DMARC1; p=none; rua=mailto:your-email@your-domain.com
    ```

## Additional Resources

For more information, you can refer to the following resources:
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin/custom-claims)
- [SendGrid Documentation](https://sendgrid.com/docs/)
- [Mailgun Documentation](https://documentation.mailgun.com/)
- [Amazon SES Documentation](https://docs.aws.amazon.com/ses/)
