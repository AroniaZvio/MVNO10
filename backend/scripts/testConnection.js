#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connection to Render PostgreSQL database
 */

const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envFile = process.env.NODE_ENV === 'render' ? 'env.render' : 'env.local';
dotenv.config({ path: path.join(process.cwd(), envFile) });

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    // Test table existence
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📋 Available tables:');
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });
    
    console.log('🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n🔧 Troubleshooting:');
      console.log('   - Check if DATABASE_URL is correct');
      console.log('   - Verify database is running');
      console.log('   - Check network connectivity');
    } else if (error.code === 'P1003') {
      console.log('\n🔧 Troubleshooting:');
      console.log('   - Database does not exist');
      console.log('   - Check database name in connection string');
    } else if (error.code === 'P1017') {
      console.log('\n🔧 Troubleshooting:');
      console.log('   - Database connection closed');
      console.log('   - Check database credentials');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection();

