const { v4: uuidv4 } = require("uuid");
const defaultGroups = require("../../defaultSeedData/defaultGroups");
const db = require("../../database/index");
const Group = db.Group;

async function seedGroups(sequelize, userCompanyId, transaction) {
  const now = new Date();
  console.log(`🌱 Seeding groups start.............. ${userCompanyId}`);

  const idMap = {};
  defaultGroups.forEach((g) => {
    idMap[g.id] = uuidv4();
  });

  const groups = defaultGroups.map((g) => ({
    ...g,
    id: idMap[g.id],
    parentGroupId: g.parentGroupId ? idMap[g.parentGroupId] : null,
    companyId: userCompanyId,
    createdAt: now,
    updatedAt: now,
  }));

  await Group.bulkCreate(groups, { ignoreDuplicates: true, transaction });
  console.log(`✅ Groups seeded successfully for company ${userCompanyId}`);
}

module.exports = seedGroups;
