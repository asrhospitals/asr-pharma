const { Op } = require('sequelize');

function buildQueryOptions(query, searchableFields = ['name'], filterFields = []) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;
  const order = query.order ? [query.order.split(',')] : [['id', 'DESC']];

  // Search
  const search = query.search || '';
  const where = {};

  if (search && searchableFields.length) {
    where[Op.or] = searchableFields.map(field => ({
      [field]: { [Op.iLike]: `%${search}%` }
    }));
  }

  filterFields.forEach(field => {
    if (query[field]) {
      where[field] = query[field];
    }
  });

  return { where, offset, limit, order, page };
}

module.exports = { buildQueryOptions };