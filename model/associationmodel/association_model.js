const Salt = require("../masters/inventory/salt");
const SaltVariation = require("../masters/inventory/salt_variations");
const Rack=require('../masters/inventory/rack');
const Store=require('../masters/inventory/store');



// A. Salt <-----> Salt Variations
Salt.hasMany(SaltVariation, { foreignKey: "salt_id", as: "saltvariations" });
SaltVariation.belongsTo(Salt, { foreignKey: "salt_id", as: "salt" });



// B. Rack <------------> Store
Rack.belongsTo(Store,{foreignKey:'storeid',as:'stores'});
Store.hasMany(Rack,{foreignKey:"storeid",as:"racks"})





module.exports = {
  Salt,
  SaltVariation,
};
