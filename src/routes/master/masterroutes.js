const express = require("express");
const router = express.Router();

const ItemController = require("../../controllers/masters/inventory/Item");
const StoreController = require("../../controllers/masters/inventory/Store");
const RackController = require("../../controllers/masters/inventory/Rack");
const CompanyController = require("../../controllers/masters/inventory/Company");
const SaltController = require("../../controllers/masters/inventory/Salt");
const HSNController = require("../../controllers/masters/inventory/HSN");
const UnitController = require("../../controllers/masters/inventory/Unit");
const ManufacturerController = require("../../controllers/masters/inventory/Manufacturer");
const SaltVariationController = require("../../controllers/masters/inventory/SaltVariation");
const PatientController = require("../../controllers/masters/other/Patient");
const DoctorController = require("../../controllers/masters/other/Doctor");
const PrescriptionController = require("../../controllers/masters/other/Prescription");
const StationController = require("../../controllers/masters/other/Station");
const BillController = require("../../controllers/sales/BillController");
const { verifyToken } = require("../../middleware/security");
const GroupController = require("../../controllers/masters/account/group");


const {
  canEditGroup,
  canDeleteGroup,
  canCreateGroup,
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger,
} = require("../../middleware/permissions/groupPermissionMiddleware");

router.post("/inventory/item/v1/add-item", ItemController.createItem);
router.get("/inventory/item/v1/get-item", ItemController.getItems);
router.get("/inventory/item/v1/get-items/:id", ItemController.getItemById);
router.put("/inventory/item/v1/update-item/:id", ItemController.updateItem);
router.delete("/inventory/item/v1/delete-item/:id", ItemController.deleteItem);

router.post("/inventory/store/v1/add-store", StoreController.createStore);
router.get("/inventory/store/v1/get-store", StoreController.getStores);
router.get("/inventory/store/v1/get-stores/:id", StoreController.getStoreById);
router.put("/inventory/store/v1/update-store/:id", StoreController.updateStore);
router.delete("/inventory/store/v1/delete-store/:id", StoreController.deleteStore);

router.post("/inventory/rack/v1/add-rack", RackController.createRack);
router.get("/inventory/rack/v1/get-rack", RackController.getRacks);
router.get("/inventory/rack/v1/get-racks/:id", RackController.getRackId);
router.put("/inventory/rack/v1/update-rack/:id", RackController.updateRack);
router.delete("/inventory/rack/v1/delete-rack/:id", RackController.deleteRack);

// Company routes
router.post("/inventory/company/v1/add-company", verifyToken, CompanyController.createCompany);
router.get("/inventory/company/v1/get-companies", verifyToken, CompanyController.getAllCompanies);
router.get("/inventory/company/v1/get-user-companies", verifyToken, CompanyController.getUserCompanies);
router.get("/inventory/company/v1/get-company/:id", verifyToken, CompanyController.getCompanyById);
router.put("/inventory/company/v1/update-company/:id", verifyToken, CompanyController.updateCompany);
router.delete("/inventory/company/v1/delete-company/:id", verifyToken, CompanyController.deleteCompany);

// Company user management
router.post("/inventory/company/v1/:companyId/add-user", verifyToken, CompanyController.addUserToCompany);
router.delete("/inventory/company/v1/:companyId/remove-user/:userId", verifyToken, CompanyController.removeUserFromCompany);

router.post("/inventory/salt/v1/add-salt", SaltController.createSalt);
router.get("/inventory/salt/v1/get-salt", SaltController.getSalt);
router.get("/inventory/salt/v1/get-salts/:id", SaltController.getSaltById);
router.put("/inventory/salt/v1/update-salt/:id", SaltController.updateSalt);
router.delete("/inventory/salt/v1/delete-salt/:id", SaltController.deleteSalt);

router.post("/inventory/hsn/v1/add-hsn", HSNController.addHSN);
router.get("/inventory/hsn/v1/get-hsn", HSNController.getAllHSN);
router.get("/inventory/hsn/v1/get-hsns/:id", HSNController.getHSNById);
router.put("/inventory/hsn/v1/update-hsn/:id", HSNController.updateHSN);
router.delete("/inventory/hsn/v1/delete-hsn/:id", HSNController.deleteHSN);

router.post("/inventory/unit/v1/add-unit", UnitController.addUnit);
router.get("/inventory/unit/v1/get-unit", UnitController.getAllUnits);
router.get("/inventory/unit/v1/get-units/:id", UnitController.getUnitById);
router.put("/inventory/unit/v1/update-unit/:id", UnitController.updateUnit);
router.delete("/inventory/unit/v1/delete-unit/:id", UnitController.deleteUnit);

router.post("/inventory/manu/v1/add-manufacturer", ManufacturerController.addManufacturer);
router.get("/inventory/manu/v1/get-manufacturer", ManufacturerController.getAllManufacturers);
router.get("/inventory/manu/v1/get-manu/:id", ManufacturerController.getManuById);
router.put("/inventory/manu/v1/update-manufacturer/:id", ManufacturerController.updateManufacturer);
router.delete("/inventory/manu/v1/delete-manufacturer/:id", ManufacturerController.deleteManufacturer);

router.post("/inventory/saltv/v1/add-saltv", SaltVariationController.addVariations);
router.get("/inventory/saltv/v1/get-saltv", SaltVariationController.getVariations);
router.put("/inventory/saltv/v1/update-saltv", SaltVariationController.updateVariation);

router.post("/other/patient/v1/add-patient", PatientController.createPatient);
router.get("/other/patient/v1/get-patient", PatientController.getAllPatients);
router.get("/other/patient/v1/get-patients/:id", PatientController.getPatientById);
router.put("/other/patient/v1/update-patient/:id", PatientController.updatePatient);
router.delete("/other/patient/v1/delete-patient/:id", PatientController.deletePatient);

router.post("/other/doctor/v1/add-doctor", DoctorController.createDoctor);
router.get("/other/doctor/v1/get-doctor", DoctorController.getDoctors);
router.get("/other/doctor/v1/get-doctors/:id", DoctorController.getDoctorById);
router.put("/other/doctor/v1/update-doctor/:id", DoctorController.updateDoctor);
router.delete("/other/doctor/v1/delete-doctor/:id", DoctorController.deleteDoctor);

router.post("/other/prescription/v1/add-prescription", PrescriptionController.createPrescription);
router.get("/other/prescription/v1/get-prescription", PrescriptionController.getPrescriptions);
router.get("/other/prescription/v1/get-prescriptions/:id", PrescriptionController.getPrescriptionById);
router.put("/other/prescription/v1/update-prescription/:id", PrescriptionController.updatePrescription);
router.delete("/other/prescription/v1/delete-prescription/:id", PrescriptionController.deletePrescription);

router.post("/other/station/v1/add-station", StationController.createStation);
router.get("/other/station/v1/get-station", StationController.getStations);
router.get("/other/station/v1/get-stations/:id", StationController.getStationById);
router.put("/other/station/v1/update-station/:id", StationController.updateStation);
router.delete("/other/station/v1/delete-station/:id", StationController.deleteStation);

// router.post("/groups", canCreateGroup, GroupController.createGroup);
// router.get("/groups", GroupController.getAllGroups);
// router.get("/groups/hierarchy", GroupController.getGroupHierarchy);
// router.get("/groups/accessible", GroupController.getAllGroups);
// router.get("/groups/type/:type", GroupController.getGroupsByType);
// router.get("/groups/parent/:parentId", GroupController.getGroupsByParent);
// router.get("/groups/available-parents", GroupController.getAvailableParents);
// router.get("/groups/:id", GroupController.getGroupById);
// router.put("/groups/:id", canEditGroup, GroupController.updateGroup);
// router.delete("/groups/:id", canDeleteGroup, GroupController.deleteGroup);

// router.get("/groups/:id/permissions", GroupController.getGroupPermissions);
// router.post("/groups/:id/permissions", GroupController.setGroupPermission);

module.exports = router;
