const express = require("express");
const router = express.Router();

const ItemController = require("../../controller/masters/inventory/Item");
const StoreController = require("../../controller/masters/inventory/Store");
const RackController = require("../../controller/masters/inventory/Rack");
const CompanyController = require("../../controller/masters/inventory/Company");
const SaltController = require("../../controller/masters/inventory/Salt");
const HSNController = require("../../controller/masters/inventory/HSN");
const UnitController = require("../../controller/masters/inventory/Unit");
const ManufacturerController = require("../../controller/masters/inventory/Manufacturer");
const SaltVariationController = require("../../controller/masters/inventory/SaltVariation");
const PatientController = require("../../controller/masters/other/Patient");
const DoctorController = require("../../controller/masters/other/Doctor");
const PrescriptionController = require("../../controller/masters/other/Prescription");
const BillController = require("../../controller/sales/BillController");

const GroupController = require("../../controller/masters/account/group");

const {
  canEditGroup,
  canDeleteGroup,
  canCreateGroup,
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger,
} = require("../../middleware/groupPermissionMiddleware");

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

router.post("/inventory/company/v1/add-company", CompanyController.createCompany);
router.get("/inventory/company/v1/get-companies", CompanyController.getAllCompanies);
router.get("/inventory/company/v1/get-companys/:id", CompanyController.getCompanyById);
router.put("/inventory/company/v1/update-company/:id", CompanyController.updateCompany);
router.delete("/inventory/company/v1/delete-company/:id", CompanyController.deleteCompany);

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

router.post("/groups", canCreateGroup, GroupController.createGroup);
router.get("/groups", GroupController.getAllGroups);
router.get("/groups/hierarchy", GroupController.getGroupHierarchy);
router.get("/groups/accessible", GroupController.getAllGroups);
router.get("/groups/type/:type", GroupController.getGroupsByType);
router.get("/groups/parent/:parentId", GroupController.getGroupsByParent);
router.get("/groups/available-parents", GroupController.getAvailableParents);
router.get("/groups/:id", GroupController.getGroupById);
router.put("/groups/:id", canEditGroup, GroupController.updateGroup);
router.delete("/groups/:id", canDeleteGroup, GroupController.deleteGroup);

router.get("/groups/:id/permissions", GroupController.getGroupPermissions);
router.post("/groups/:id/permissions", GroupController.setGroupPermission);

module.exports = router;
