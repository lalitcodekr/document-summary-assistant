// Empty stub — replaces the Draco decoder chunk that @splinetool/runtime
// tries to load via import.meta.url (which Turbopack cannot resolve).
// Draco decompression is optional in Spline; the scene still loads fine
// through the normal glTF path without it.
const stub = {};
export default stub;
