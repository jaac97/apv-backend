import Vet from "./Vet.js";
import Patient from "./Patient.js";

Vet.hasMany(Patient)
Patient.belongsTo(Vet)

export {Vet, Patient}