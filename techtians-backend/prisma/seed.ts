import { PrismaClient, RoleName } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Ed-Tech Database Seeding...');

  // 1. Seed Roles
  const rolesData: { name: RoleName; description: string }[] = [
    {
      name: RoleName.STUDENT,
      description: 'Student role with access to enrolled courses, lectures, tests, and doubts',
    },
    {
      name: RoleName.TEACHER,
      description:
        'Teacher role with permission to manage lectures, tests, assignments, and doubts',
    },
    {
      name: RoleName.ADMIN,
      description:
        'Administrative role with operational management over batches, courses, and users',
    },
    {
      name: RoleName.SUPER_ADMIN,
      description: 'Super administrator role with full platform and permission control',
    },
  ];

  const roleMap = new Map<RoleName, string>();

  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
    roleMap.set(role.name, role.id);
    console.log(`  ✓ Role ensured: ${role.name}`);
  }

  // 2. Seed Permissions (course, batch, lecture, test, doubt, order, user)
  const permissionsData: { key: string; description: string }[] = [
    // Course management
    { key: 'course.create', description: 'Create new course catalog entries' },
    { key: 'course.read', description: 'View course details and catalog' },
    { key: 'course.update', description: 'Update course details and curriculum' },
    { key: 'course.delete', description: 'Delete or archive courses' },
    { key: 'course.publish', description: 'Publish or unpublish courses' },

    // Batch management
    { key: 'batch.create', description: 'Create student cohorts and batches' },
    { key: 'batch.read', description: 'View batch schedules and enrolments' },
    { key: 'batch.update', description: 'Update batch configurations and instructors' },
    { key: 'batch.delete', description: 'Delete batches' },

    // Lecture management
    { key: 'lecture.create', description: 'Schedule and add lectures/sessions' },
    { key: 'lecture.read', description: 'Attend or stream lecture recordings' },
    { key: 'lecture.update', description: 'Edit lecture resources and timestamps' },
    { key: 'lecture.delete', description: 'Delete lectures' },

    // Test / Assessment management
    { key: 'test.create', description: 'Create tests, mock exams, and questions' },
    { key: 'test.read', description: 'Take tests and view scorecards' },
    { key: 'test.update', description: 'Update tests and question banks' },
    { key: 'test.delete', description: 'Delete tests' },
    { key: 'test.evaluate', description: 'Grade and evaluate subjective tests' },

    // Doubt resolution
    { key: 'doubt.create', description: 'Submit questions and academic doubts' },
    { key: 'doubt.read', description: 'Browse and read answered doubts' },
    { key: 'doubt.answer', description: 'Answer student doubts as instructor' },
    { key: 'doubt.resolve', description: 'Mark doubts as verified and resolved' },

    // Order and Payment management
    { key: 'order.create', description: 'Purchase course or test-series subscriptions' },
    { key: 'order.read', description: 'View transaction histories and invoices' },
    { key: 'order.refund', description: 'Issue refunds and cancel orders' },

    // User & IAM management
    { key: 'user.create', description: 'Provision user accounts' },
    { key: 'user.read', description: 'View user profiles and directories' },
    { key: 'user.update', description: 'Update user profiles and statuses' },
    { key: 'user.delete', description: 'Soft-delete or purge user records' },
    { key: 'user.manage_roles', description: 'Assign or revoke roles and permissions' },
  ];

  const permissionIds: string[] = [];

  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { key: p.key },
      update: { description: p.description },
      create: p,
    });
    permissionIds.push(perm.id);
  }
  console.log(`  ✓ Permissions ensured: ${permissionsData.length} permissions`);

  // 3. Assign Permissions to Roles
  const superAdminRoleId = roleMap.get(RoleName.SUPER_ADMIN)!;
  const adminRoleId = roleMap.get(RoleName.ADMIN)!;
  const teacherRoleId = roleMap.get(RoleName.TEACHER)!;
  const studentRoleId = roleMap.get(RoleName.STUDENT)!;

  // SUPER_ADMIN gets all permissions
  for (const permId of permissionIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: superAdminRoleId, permissionId: permId },
      },
      update: {},
      create: { roleId: superAdminRoleId, permissionId: permId },
    });
  }

  // ADMIN gets management permissions (all except role elevation)
  const adminPermKeys = permissionsData
    .filter((p) => p.key !== 'user.manage_roles')
    .map((p) => p.key);
  const adminPermRecords = await prisma.permission.findMany({
    where: { key: { in: adminPermKeys } },
  });
  for (const p of adminPermRecords) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: adminRoleId, permissionId: p.id },
      },
      update: {},
      create: { roleId: adminRoleId, permissionId: p.id },
    });
  }

  // TEACHER permissions
  const teacherPermKeys = [
    'course.read',
    'course.update',
    'batch.read',
    'lecture.create',
    'lecture.read',
    'lecture.update',
    'test.create',
    'test.read',
    'test.update',
    'test.evaluate',
    'doubt.read',
    'doubt.answer',
    'doubt.resolve',
  ];
  const teacherPermRecords = await prisma.permission.findMany({
    where: { key: { in: teacherPermKeys } },
  });
  for (const p of teacherPermRecords) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: teacherRoleId, permissionId: p.id },
      },
      update: {},
      create: { roleId: teacherRoleId, permissionId: p.id },
    });
  }

  // STUDENT permissions
  const studentPermKeys = [
    'course.read',
    'batch.read',
    'lecture.read',
    'test.read',
    'doubt.create',
    'doubt.read',
    'order.create',
    'order.read',
  ];
  const studentPermRecords = await prisma.permission.findMany({
    where: { key: { in: studentPermKeys } },
  });
  for (const p of studentPermRecords) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: studentRoleId, permissionId: p.id },
      },
      update: {},
      create: { roleId: studentRoleId, permissionId: p.id },
    });
  }
  console.log('  ✓ Role permissions mapped successfully.');

  // 4. Seed Default Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@techtians.com';
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';
  const adminPhone = '+919999999999';

  const passwordHash = await bcrypt.hash(adminRawPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      phone: adminPhone,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      phone: adminPhone,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    },
  });

  // Ensure AdminProfile
  await prisma.adminProfile.upsert({
    where: { userId: adminUser.id },
    update: { designation: 'Platform Lead' },
    create: {
      userId: adminUser.id,
      designation: 'Platform Lead',
    },
  });

  // Assign SUPER_ADMIN and ADMIN roles
  for (const roleId of [superAdminRoleId, adminRoleId]) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: adminUser.id, roleId },
      },
      update: {},
      create: { userId: adminUser.id, roleId },
    });
  }

  console.log(
    `  ✓ Admin user seeded: ${adminUser.email} with SUPER_ADMIN & ADMIN roles and AdminProfile`,
  );
  console.log('✅ Ed-Tech database seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
