const Router=require('express');
const router=Router();

const { createItem, getItems, updateItem, deleteItem } = require('../../controller/masters/inventory/Item');
const { createStore, getStores, updateStore, deleteStore } = require('../../controller/masters/inventory/Store');
const { createRack, getRacks, updateRack, deleteRack } = require('../../controller/masters/inventory/Rack');
const { createCompany, updateCompany, deleteCompany, getAllCompanies } = require('../../controller/masters/inventory/Company');
const { createSalt, updateSalt, deleteSalt, getSalt } = require('../../controller/masters/inventory/Salt');
const { updateHSN, deleteHSN, addHSN, getAllHSN } = require('../../controller/masters/inventory/HSN');
const { updateUnit, deleteUnit, addUnit, getAllUnits } = require('../../controller/masters/inventory/Unit');
const { addManufacturer, getAllManufacturers, updateManufacturer, deleteManufacturer } = require('../../controller/masters/inventory/Manufacturer');





//------------------------------------------------Item Inventory  Routes-----------------------------------

// 1. Add Item
router.route('/inventory/item/v1/add-item').post(createItem);
// 2. Get All Items
router.route('/inventory/item/v1/get-item').get(getItems);
// 3. Update Item from Item Id
router.route('/inventory/item/v1/update-item/:id').put(updateItem);
// 4. Delete Item from Item Id
router.route('/inventory/item/v1/delete-item/:id').delete(deleteItem);


//-------------------------------------------------Store Inventory Routes----------------------------------

// 5. Add Store
router.route('/inventory/store/v1/add-store').post(createStore);

// 6. Get All Stores
 router.route('/inventory/store/v1/get-store').get(getStores);

// 7. Update Store from Store Id
 router.route('/inventory/store/v1/update-store/:id').put(updateStore);

// 8. Delete Store from Store Id
router.route('/inventory/store/v1/delete-store/:id').delete(deleteStore);


//--------------------------------------------------Rack Inventory Routes-------------------------------------

// 9. Add Rack
router.route('/inventory/rack/v1/add-rack').post(createRack);

// 10. Get All Racks
router.route('/inventory/rack/v1/get-rack').get(getRacks);

// 11. Update Rack from Rack Id
router.route('/inventory/rack/v1/update-rack/:id').put(updateRack);

// 12. Delete Rack from Rack Id
router.route('/inventory/rack/v1/delete-rack/:id').delete(deleteRack);


//--------------------------------------------------Company Inventory Routes-----------------------------------

// 13. Create a new company
router.route('/inventory/company/v1/add-company').post(createCompany);

// 14. Get all companies 
router.route('/inventory/company/v1/get-companies').get(getAllCompanies);

// 15. Update company by ID
router.route('/inventory/company/v1/update-company/:id').put(updateCompany);

// 16. Delete company by ID
router.route('/inventory/company/v1/delete-company/:id').delete(deleteCompany);


//---------------------------------------------------Salt Inventory Routes-------------------------------------

// 17. Add Salt
router.route('/inventory/salt/v1/add-salt').post(createSalt);

// 18. Get Salt
router.route('/inventory/salt/v1/get-salt').get(getSalt);

// 19.Update Salt
router.route('/inventory/salt/v1/update-salt/:id').put(updateSalt);

// 20.Delete salt
router.route('/inventory/salt/v1/delete-salt/:id').delete(deleteSalt);


//--------------------------------------------------HSN Inventory Routes---------------------------------------

// 21.Add HSN
router.route('/inventory/hsn/v1/add-hsn').post(addHSN);

// 22.Get all HSNs
router.route('/inventory/hsn/v1/get-hsn').get(getAllHSN);

// 23.Update HSN by ID
 router.route('/inventory/hsn/v1/update-hsn/:id').put(updateHSN);

// 24.Delete HSN by ID
router.route('/inventory/hsn/v1/delete-hsn/:id').delete(deleteHSN);



//---------------------------------------------------Unit Inventory Routes------------------------------

// 25. Add Unit
router.route('/inventory/unit/v1/add-unit').post(addUnit);

// 26. Get All Units
router.route('/inventory/unit/v1/get-unit').get(getAllUnits);

// 27. Update Unit
router.route('/inventory/unit/v1/update-unit/:id').put(updateUnit);

// 28. Delete Unit
router.route('/inventory/unit/v1/delete-unit/:id').delete(deleteUnit);


//-----------------------------------------------------Manufacturer Inventory Routes-----------------------------------

// 29.Add Manufacturer
router.route('/inventory/manu/v1/add-manufacturer').post(addManufacturer);

// 30.Get All Manufacturers
router.route('/inventory/manu/v1/get-manufacturer').get(getAllManufacturers);

// 31.Update Manufacturer by ID
router.route('/inventory/manu/v1/update-manufacturer/:id').put(updateManufacturer);

// 32.Delete Manufacturer by ID
router.route('/inventory/manu/v1/delete-manufacturer/:id').delete(deleteManufacturer);









module.exports=router;