const Router=require('express');
const router=Router();

const { createItem, getItems, updateItem, deleteItem, getItemById } = require('../../controller/masters/inventory/Item');
const { createStore, getStores, updateStore, deleteStore, getStoreById } = require('../../controller/masters/inventory/Store');
const { createRack, getRacks, updateRack, deleteRack, getRackId } = require('../../controller/masters/inventory/Rack');
const { createCompany, updateCompany, deleteCompany, getAllCompanies, getCompanyById } = require('../../controller/masters/inventory/Company');
const { createSalt, updateSalt, deleteSalt, getSalt, getSaltById } = require('../../controller/masters/inventory/Salt');
const { updateHSN, deleteHSN, addHSN, getAllHSN, getHSNById } = require('../../controller/masters/inventory/HSN');
const { updateUnit, deleteUnit, addUnit, getAllUnits, getUnitById } = require('../../controller/masters/inventory/Unit');
const { addManufacturer, getAllManufacturers, updateManufacturer, deleteManufacturer, getManuById } = require('../../controller/masters/inventory/Manufacturer');
const { addVariations, getVariations, updateVariation } = require('../../controller/masters/inventory/SaltVariation');





//------------------------------------------------Item Inventory  Routes-----------------------------------

// 1. Add Item
router.route('/inventory/item/v1/add-item').post(createItem);

// 2. Get All Items
router.route('/inventory/item/v1/get-item').get(getItems);

// 3.  Get All Items by id
router.route('/inventory/item/v1/get-items/:id').get(getItemById);

// 4. Update Item from Item Id
router.route('/inventory/item/v1/update-item/:id').put(updateItem);

// 5. Delete Item from Item Id
router.route('/inventory/item/v1/delete-item/:id').delete(deleteItem);


//-------------------------------------------------Store Inventory Routes----------------------------------

// 6. Add Store
router.route('/inventory/store/v1/add-store').post(createStore);

// 7. Get All Stores
 router.route('/inventory/store/v1/get-store').get(getStores);

// 8. Get Stores by Id 
 router.route('/inventory/store/v1/get-stores/:id').get(getStoreById);

// 9. Update Store from Store Id
 router.route('/inventory/store/v1/update-store/:id').put(updateStore);

// 10. Delete Store from Store Id
router.route('/inventory/store/v1/delete-store/:id').delete(deleteStore);


//--------------------------------------------------Rack Inventory Routes-------------------------------------

// 11. Add Rack
router.route('/inventory/rack/v1/add-rack').post(createRack);

// 12. Get All Racks
router.route('/inventory/rack/v1/get-rack').get(getRacks);

// 13. Get Racks By Id
router.route('/inventory/rack/v1/get-racks/:id').get(getRackId);

// 14. Update Rack from Rack Id
router.route('/inventory/rack/v1/update-rack/:id').put(updateRack);

// 15. Delete Rack from Rack Id
router.route('/inventory/rack/v1/delete-rack/:id').delete(deleteRack);


//--------------------------------------------------Company Inventory Routes-----------------------------------

// 16. Create a new company
router.route('/inventory/company/v1/add-company').post(createCompany);

// 17. Get all companies 
router.route('/inventory/company/v1/get-companies').get(getAllCompanies);

// 18. Get Company By Id
router.route('/inventory/company/v1/get-companys/:id').get(getCompanyById);

// 19. Update company by ID
router.route('/inventory/company/v1/update-company/:id').put(updateCompany);

// 20. Delete company by ID
router.route('/inventory/company/v1/delete-company/:id').delete(deleteCompany);


//---------------------------------------------------Salt Inventory Routes-------------------------------------

// 21. Add Salt
router.route('/inventory/salt/v1/add-salt').post(createSalt);

// 22. Get Salt
router.route('/inventory/salt/v1/get-salt').get(getSalt);

// 23. Get Salt By Id
router.route('/inventory/salt/v1/get-salts/:id').get(getSaltById);

// 24.Update Salt
router.route('/inventory/salt/v1/update-salt/:id').put(updateSalt);

// 25.Delete salt
router.route('/inventory/salt/v1/delete-salt/:id').delete(deleteSalt);


//--------------------------------------------------HSN Inventory Routes---------------------------------------

// 26.Add HSN
router.route('/inventory/hsn/v1/add-hsn').post(addHSN);

// 27.Get all HSNs
router.route('/inventory/hsn/v1/get-hsn').get(getAllHSN);

// 28. Get HSN by ID
router.route('/inventory/hsn/v1/get-hsns/:id').get(getHSNById);

// 29.Update HSN by ID
 router.route('/inventory/hsn/v1/update-hsn/:id').put(updateHSN);

// 30.Delete HSN by ID
router.route('/inventory/hsn/v1/delete-hsn/:id').delete(deleteHSN);



//---------------------------------------------------Unit Inventory Routes------------------------------

// 31. Add Unit
router.route('/inventory/unit/v1/add-unit').post(addUnit);

// 32. Get All Units
router.route('/inventory/unit/v1/get-unit').get(getAllUnits);

// 33. Get Unit By Ids
router.route('/inventory/unit/v1/get-units/:id').get(getUnitById);

// 34. Update Unit
router.route('/inventory/unit/v1/update-unit/:id').put(updateUnit);

// 35. Delete Unit
router.route('/inventory/unit/v1/delete-unit/:id').delete(deleteUnit);


//-----------------------------------------------------Manufacturer Inventory Routes-----------------------------------

// 36.Add Manufacturer
router.route('/inventory/manu/v1/add-manufacturer').post(addManufacturer);

// 37.Get All Manufacturers
router.route('/inventory/manu/v1/get-manufacturer').get(getAllManufacturers);

// 38. A. Get Manufactures by Id
router.route('/inventory/manu/v1/get-manu/:id').get(getManuById);

// 39.Update Manufacturer by ID
router.route('/inventory/manu/v1/update-manufacturer/:id').put(updateManufacturer);

// 40.Delete Manufacturer by ID
router.route('/inventory/manu/v1/delete-manufacturer/:id').delete(deleteManufacturer);



//---------------------------------------------Salt Variation Routes-----------------------------------

// 41. Add Salt Vatiations
router.route('/inventory/saltv/v1/add-saltv').post(addVariations);

// 42. Get Salts Variations
router.route('/inventory/saltv/v1/get-saltv').get(getVariations);

// 43. Update Salt Variation
router.route('/inventory/saltv/v1/update-saltv').put(updateVariation);


module.exports=router;