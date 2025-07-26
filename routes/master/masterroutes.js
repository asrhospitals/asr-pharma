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
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger,
} = require("../../middleware/groupPermissionMiddleware");

router.post("/item", ItemController.createItem);
router.get("/item", ItemController.getItems);
router.get("/item/:id", ItemController.getItemById);
router.put("/item/:id", ItemController.updateItem);
router.delete("/item/:id", ItemController.deleteItem);

router.post("/store", StoreController.createStore);
router.get("/store", StoreController.getStores);
router.get("/store/:id", StoreController.getStoreById);
router.put("/store/:id", StoreController.updateStore);
router.delete("/store/:id", StoreController.deleteStore);

router.post("/rack", RackController.createRack);
router.get("/rack", RackController.getRacks);
router.get("/rack/:id", RackController.getRackId);
router.put("/rack/:id", RackController.updateRack);
router.delete("/rack/:id", RackController.deleteRack);

router.post("/company", CompanyController.createCompany);
router.get("/company", CompanyController.getAllCompanies);
router.get("/company/:id", CompanyController.getCompanyById);
router.put("/company/:id", CompanyController.updateCompany);
router.delete("/company/:id", CompanyController.deleteCompany);

router.post("/salt", SaltController.createSalt);
router.get("/salt", SaltController.getSalt);
router.get("/salt/:id", SaltController.getSaltById);
router.put("/salt/:id", SaltController.updateSalt);
router.delete("/salt/:id", SaltController.deleteSalt);

router.post("/hsn", HSNController.addHSN);
router.get("/hsn", HSNController.getAllHSN);
router.get("/hsn/:id", HSNController.getHSNById);
router.put("/hsn/:id", HSNController.updateHSN);
router.delete("/hsn/:id", HSNController.deleteHSN);

router.post("/unit", UnitController.addUnit);
router.get("/unit", UnitController.getAllUnits);
router.get("/unit/:id", UnitController.getUnitById);
router.put("/unit/:id", UnitController.updateUnit);
router.delete("/unit/:id", UnitController.deleteUnit);

router.post("/manufacturer", ManufacturerController.addManufacturer);
router.get("/manufacturer", ManufacturerController.getAllManufacturers);
router.get("/manufacturer/:id", ManufacturerController.getManuById);
router.put("/manufacturer/:id", ManufacturerController.updateManufacturer);
router.delete("/manufacturer/:id", ManufacturerController.deleteManufacturer);

router.post("/salt-variation", SaltVariationController.addVariations);
router.get("/salt-variation", SaltVariationController.getVariations);
router.put("/salt-variation/:id", SaltVariationController.updateVariation);

router.post("/patient", PatientController.createPatient);
router.get("/patient", PatientController.getAllPatients);
router.get("/patient/:id", PatientController.getPatientById);
router.put("/patient/:id", PatientController.updatePatient);
router.delete("/patient/:id", PatientController.deletePatient);

router.post("/doctor", DoctorController.createDoctor);
router.get("/doctor", DoctorController.getDoctors);
router.get("/doctor/:id", DoctorController.getDoctorById);
router.put("/doctor/:id", DoctorController.updateDoctor);
router.delete("/doctor/:id", DoctorController.deleteDoctor);

router.post("/prescription", PrescriptionController.createPrescription);
router.get("/prescription", PrescriptionController.getPrescriptions);
router.get("/prescription/:id", PrescriptionController.getPrescriptionById);
router.put("/prescription/:id", PrescriptionController.updatePrescription);
router.delete("/prescription/:id", PrescriptionController.deletePrescription);

router.post("/accounting/groups/v1", canEditGroup, GroupController.createGroup);
router.get("/accounting/groups/v1", GroupController.getAllGroups);
router.get(
  "/accounting/groups/v1/hierarchy",
  GroupController.getGroupHierarchy
);
router.get("/accounting/groups/v1/accessible", GroupController.getAllGroups);
router.get("/accounting/groups/v1/type/:type", GroupController.getGroupsByType);
router.get(
  "/accounting/groups/v1/parent/:parentId",
  GroupController.getGroupsByParent
);
router.get(
  "/accounting/groups/v1/available-parents",
  GroupController.getAvailableParents
);
router.get("/accounting/groups/v1/:id", GroupController.getGroupById);
router.put(
  "/accounting/groups/v1/:id",
  canEditGroup,
  GroupController.updateGroup
);
router.delete(
  "/accounting/groups/v1/:id",
  canDeleteGroup,
  GroupController.deleteGroup
);

router.get(
  "/accounting/groups/v1/:id/permissions",
  GroupController.getGroupPermissions
);
router.post(
  "/accounting/groups/v1/:id/permissions",
  GroupController.setGroupPermission
);

// router.get("/accounting/groups/v1/:id/ledgers", canViewLedger, GroupController.getGroupLedgers);
// router.post("/accounting/groups/v1/:id/ledgers", canCreateLedger, GroupController.createGroupLedger);
// router.put("/accounting/groups/v1/:id/ledgers/:ledgerId", canEditLedger, GroupController.updateGroupLedger);
// router.delete("/accounting/groups/v1/:id/ledgers/:ledgerId", canDeleteLedger, GroupController.deleteGroupLedger);

module.exports = router;
