// ============================================
// FILE: scripts/generateAdminHash.js
// Run: node scripts/generateAdminHash.js
// ============================================
const bcrypt = require('bcryptjs');

async function generateAdminData() {
  // CHANGE THIS PASSWORD to whatever you want
  const plainPassword = 'YourSecurePassword123!';
  
  // Generate hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  
  const adminData = {
    firstName: "Super",
    lastName: "Admin",
    email: "admin@skillspocket.com",
    password: hashedPassword,
    role: "super_admin",
    permissions: [
      "manage_users",
      "manage_jobs",
      "manage_disputes",
      "manage_settings",
      "manage_admins",
      "view_analytics"
    ],
    profilePicture: null,
    isActive: true,
    lastLogin: null,
    loginAttempts: 0,
    lockUntil: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  console.log('==========================================');
  console.log('🔐 ADMIN USER DATA FOR MONGODB');
  console.log('==========================================\n');
  console.log('📧 Email:', adminData.email);
  console.log('🔑 Password:', plainPassword);
  console.log('👤 Role:', adminData.role);
  console.log('\n==========================================');
  console.log('📋 COPY THIS JSON TO MONGODB:');
  console.log('==========================================\n');
  console.log(JSON.stringify(adminData, null, 2));
  console.log('\n==========================================');
  console.log('📝 MONGODB SHELL COMMAND:');
  console.log('==========================================\n');
  console.log(`db.admins.insertOne(${JSON.stringify(adminData, null, 2)})`);
  console.log('\n==========================================');
}

generateAdminData().catch(console.error);