# Authentication Setup Guide

This guide explains how to set up Netlify Identity for admin authentication on your site.

## Overview

Your site uses **Netlify Identity** for secure admin authentication. This is an industry-standard solution that provides:

- ✅ Secure user authentication
- ✅ Role-based access control
- ✅ Email verification
- ✅ Password reset functionality
- ✅ No additional database setup required

## Setup Steps

### Step 1: Deploy to Netlify

First, deploy your site to Netlify following the [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

### Step 2: Enable Netlify Identity

1. Go to your Netlify site dashboard
2. Navigate to **"Identity"** in the sidebar
3. Click **"Enable Identity"**

### Step 3: Configure Identity Settings

#### Registration Settings

1. In Identity settings, go to **"Registration"**
2. Set registration to **"Invite only"** (recommended for admin-only access)
3. Enable **"Email confirmation"**

#### External Providers (Optional)

You can enable login with Google, GitHub, etc.:

1. Go to **"External providers"**
2. Enable desired providers (Google recommended)
3. Configure OAuth settings

### Step 4: Create Admin User

#### Option A: Invite Yourself

1. In Identity dashboard, click **"Invite users"**
2. Enter your email address
3. Check your email and complete registration

#### Option B: Allow Registration (Temporarily)

1. Set registration to **"Open"** temporarily
2. Visit your site at `/admin`
3. Click "Log In" → "Sign Up"
4. Complete registration
5. **Important**: Change registration back to "Invite only"

### Step 5: Assign Admin Role

1. In Netlify Identity dashboard, find your user
2. Click on the user to edit
3. In **"User metadata"**, add:
   ```json
   {
   	"roles": ["admin"]
   }
   ```
4. Save changes

### Step 6: Test Authentication

1. Visit your site at `/admin`
2. You should see a login prompt
3. Log in with your credentials
4. You should see the admin dashboard

## Admin Dashboard Features

### Current Features

- **Blog Post Management**: View all posts, toggle published/draft status
- **Featured Posts**: Mark posts as featured
- **Quick Actions**: Links to Netlify analytics and forms
- **Secure Access**: Only users with "admin" role can access

### Planned Features

- Blog post editor
- Image upload management
- Site analytics integration
- Content scheduling

## Security Features

### Built-in Security

- **JWT Tokens**: Secure authentication tokens
- **Role-based Access**: Only admin users can access dashboard
- **Email Verification**: Prevents unauthorized signups
- **Password Requirements**: Enforced by Netlify
- **Rate Limiting**: Built-in protection against brute force

### Additional Security

- **HTTPS Only**: All authentication over secure connections
- **Session Management**: Automatic token refresh
- **Logout Protection**: Secure session termination

## Troubleshooting

### Common Issues

**Can't Access Admin Dashboard**

1. Verify you have the "admin" role assigned
2. Check that Identity is enabled on your site
3. Clear browser cache and try again

**Login Button Not Working**

1. Check browser console for errors
2. Verify Netlify Identity script is loaded
3. Ensure site is deployed (doesn't work on localhost)

**Email Not Received**

1. Check spam folder
2. Verify email address is correct
3. Try resending invitation

### Debug Steps

1. **Check Identity Status**:

   ```javascript
   // In browser console
   console.log(window.netlifyIdentity.currentUser());
   ```

2. **Verify Role Assignment**:

   ```javascript
   // Check user roles
   const user = window.netlifyIdentity.currentUser();
   console.log(user?.app_metadata?.roles);
   ```

3. **Test Authentication Flow**:
   - Visit `/admin`
   - Open browser dev tools
   - Check for JavaScript errors
   - Verify network requests to Netlify Identity

## User Management

### Adding More Admins

1. Go to Netlify Identity dashboard
2. Click "Invite users"
3. Enter email addresses
4. Assign "admin" role to each user

### Removing Access

1. Find user in Identity dashboard
2. Either delete user or remove "admin" role
3. User will lose admin access immediately

### Role Management

You can create different roles:

- `admin`: Full access to dashboard
- `editor`: Limited editing access (future feature)
- `viewer`: Read-only access (future feature)

## Development vs Production

### Development

- Authentication works only on deployed sites
- Use `npm run build && npm run preview` for local testing
- Or deploy to Netlify for full testing

### Production

- Full authentication functionality
- Email notifications work
- All security features active

## Integration with CMS

### Current Setup

- JSON-based blog posts
- Manual file editing for new posts
- Admin dashboard for status management

### Future CMS Integration

The authentication system is ready for:

- Database-backed content management
- Rich text editors
- Media management
- Content scheduling
- Multi-user workflows

## API Integration

### Accessing User Data

```javascript
import { user, isAuthenticated, isAdmin } from '$lib/utils/auth.js';

// Check authentication status
if ($isAuthenticated) {
	console.log('User is logged in:', $user);
}

// Check admin status
if ($isAdmin) {
	console.log('User has admin access');
}
```

### Protecting Routes

```javascript
import { protectAdminRoute } from '$lib/utils/auth.js';

// In your page component
onMount(() => {
	if (!protectAdminRoute()) {
		// User will be redirected
		return;
	}
	// Continue with admin functionality
});
```

## Best Practices

### Security

- ✅ Use "Invite only" registration
- ✅ Enable email confirmation
- ✅ Regularly review user access
- ✅ Use strong passwords
- ✅ Enable 2FA when available

### User Experience

- ✅ Clear login/logout flows
- ✅ Helpful error messages
- ✅ Responsive admin interface
- ✅ Mobile-friendly authentication

### Maintenance

- ✅ Monitor failed login attempts
- ✅ Review user roles quarterly
- ✅ Keep authentication library updated
- ✅ Test authentication flows regularly

## Support

### Netlify Identity Documentation

- [Official Docs](https://docs.netlify.com/visitor-access/identity/)
- [Widget Documentation](https://github.com/netlify/netlify-identity-widget)

### Common Resources

- [JWT.io](https://jwt.io/) - Decode authentication tokens
- [Netlify Community](https://community.netlify.com/) - Get help from community
- [Status Page](https://www.netlifystatus.com/) - Check service status

Your authentication system is now ready for secure admin access! 🔐
