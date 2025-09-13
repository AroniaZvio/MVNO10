# 🗄️ Render Database Connection Setup

## 📋 Overview

This guide will help you connect your MVNO backend to a PostgreSQL database on Render.

## 🚀 Quick Setup Steps

### 1. Create Render PostgreSQL Database

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"PostgreSQL"**
3. **Configure Database**:
   - **Name**: `mobilive-db`
   - **Database**: `mvno_db`
   - **User**: `mvno_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (for testing) or Starter (for production)

4. **Wait for Database Creation** (2-3 minutes)

### 2. Get Database Connection String

1. **Click on your database** in Render dashboard
2. **Go to "Info" tab**
3. **Copy the "External Database URL"** - it looks like:
   ```
   postgresql://mvno_user:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/mvno_db
   ```

### 3. Update Environment Configuration

Update the `backend/env.render` file with your actual database URL:

```bash
# Replace the DATABASE_URL with your actual Render database URL
DATABASE_URL=postgresql://mvno_user:your-password@dpg-xxxxx-a.oregon-postgres.render.com:5432/mvno_db
```

### 4. Test Database Connection Locally

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
```

### 5. Deploy to Render

1. **Push your code to Git**:
   ```bash
   git add .
   git commit -m "Add Render database configuration"
   git push origin main
   ```

2. **Deploy via Render Dashboard**:
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file
   - The database will be created and connected automatically

## 🔧 Manual Database Setup (Alternative)

If you prefer to set up the database manually:

### 1. Create Database Service in render.yaml

The `render.yaml` file already includes a PostgreSQL service:

```yaml
- type: pserv
  name: mobilive-db
  env: postgresql
  plan: free
  ipAllowList: []
```

### 2. Set Environment Variables in Render

In your web service settings, add these environment variables:

- `NODE_ENV`: `render`
- `DATABASE_URL`: `${{mobilive-db.DATABASE_URL}}` (auto-generated)
- `JWT_SECRET`: Generate a strong secret
- `SMTP_HOST`: `smtp.gmail.com`
- `SMTP_PORT`: `587`
- `SMTP_USER`: Your Gmail address
- `SMTP_PASS`: Your Gmail app password
- `SMTP_FROM`: `noreply@yourdomain.com`
- `CORS_ORIGIN`: `https://your-app.onrender.com`

## 🗃️ Database Schema Setup

The application will automatically:
1. **Run migrations** on startup (`prisma migrate deploy`)
2. **Create all tables** based on your Prisma schema
3. **Set up relationships** between tables

### Manual Migration (if needed)

```bash
# Connect to your Render database
psql "postgresql://mvno_user:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/mvno_db"

# Or use Prisma Studio
npm run prisma:studio
```

## 🔍 Verify Connection

### 1. Check Render Logs

1. Go to your web service in Render dashboard
2. Click on "Logs" tab
3. Look for successful database connection messages

### 2. Test API Endpoints

```bash
# Health check
curl https://your-app.onrender.com/health

# Test database connection
curl https://your-app.onrender.com/api/health
```

### 3. Check Database Tables

```bash
# Connect to database
psql "your-database-url"

# List tables
\dt

# Check users table
SELECT * FROM "User" LIMIT 5;
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check if database is running in Render dashboard
   - Verify DATABASE_URL format
   - Ensure database is in the same region as your app

2. **Migration Errors**:
   - Check Prisma schema syntax
   - Verify database permissions
   - Run migrations manually if needed

3. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable names and values
   - Restart service after changes

### Debug Commands

```bash
# Test database connection
npm run prisma:studio

# Check Prisma client
npm run prisma:generate

# Run migrations manually
npm run prisma:migrate:deploy

# Reset database (careful!)
npm run db:reset
```

## 📊 Database Monitoring

### Render Dashboard
- Monitor database performance
- Check connection count
- View query logs

### Prisma Studio
- Visual database browser
- Run queries
- Manage data

```bash
npm run prisma:studio
```

## 🔒 Security Best Practices

1. **Use Environment Variables**: Never hardcode database credentials
2. **Restrict Access**: Use Render's IP allowlist if needed
3. **Regular Backups**: Enable automatic backups in Render
4. **Monitor Usage**: Watch for unusual activity
5. **Update Dependencies**: Keep Prisma and database drivers updated

## 📈 Scaling Considerations

### Free Plan Limitations
- 1GB storage
- 1GB RAM
- Shared resources

### Upgrade to Starter Plan
- 1GB storage
- 512MB RAM
- Better performance
- More reliable

### Production Recommendations
- Use dedicated database plan
- Enable automatic backups
- Set up monitoring alerts
- Consider read replicas for high traffic

## 🎯 Next Steps

1. ✅ Set up Render PostgreSQL database
2. ✅ Configure environment variables
3. ✅ Deploy application
4. ✅ Test database connection
5. ✅ Seed initial data (if needed)
6. ✅ Set up monitoring
7. ✅ Configure backups

---

**Your database is now connected to Render! 🎉**

For any issues, check the Render logs and ensure all environment variables are properly set.

