import "./firebase";

export {
	bootstrapFirstAdmin,
	setUserRole,
	whoAmI,
} from "./api/auth";
export {
	calculateAmount,
	createBooking,
	listActiveVehicles,
} from "./api/booking";
export { syncRoleClaims } from "./triggers/syncRoleClaims";
