const defaultGroups = require("../../defaultSeedData/defaultGroups");
const db = require("../../database/index");
const Group = db.Group;

async function seedGroups(sequelize, userCompanyId) {
  const now = new Date();
  console.log(`🌱 Seeding groups start.............. ${userCompanyId}`);

  const groups = defaultGroups.map((g) => ({
    ...g,
    companyId: userCompanyId,
    createdAt: now,
    updatedAt: now,
  }));

  // await sequelize.query(
  //   `
  //   INSERT INTO groups
  //     (company_id, group_name, under_group, parent_group_id, group_type,
  //      is_default, is_editable, is_deletable, prohibit, description, sort_order,
  //      status, created_at, updated_at)
  //   VALUES
  //     ${groups
  //       .map(
  //         (_, i) =>
  //           `($${i * 14 + 1}, $${i * 14 + 2}, $${i * 14 + 3}, $${
  //             i * 14 + 4
  //           }, $${i * 14 + 5},
  //         $${i * 14 + 6}, $${i * 14 + 7}, $${i * 14 + 8}, $${i * 14 + 9}, $${
  //             i * 14 + 10
  //           },
  //         $${i * 14 + 11}, $${i * 14 + 12}, $${i * 14 + 13}, $${i * 14 + 14})`
  //       )
  //       .join(", ")}
  // `,
  //   groups.flatMap((g) => [
  //     g.companyId,
  //     g.groupName,
  //     g.undergroup,
  //     g.parentGroupId,
  //     g.groupType,
  //     g.isDefault,
  //     g.isEditable,
  //     g.isDeletable,
  //     g.prohibit,
  //     g.description,
  //     g.sortOrder,
  //     g.status,
  //     g.createdAt,
  //     g.updatedAt,
  //   ])
  // );

  await Group.bulkCreate(groups);

  console.log(`🌱 Seeded ${groups.length} groups for company ${userCompanyId}`);
}

module.exports = { seedGroups };
