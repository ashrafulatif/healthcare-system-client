export type UserRole = "ADMIN" | "SUPER_ADMIN" | "DOCTOR" | "PATIENT";

export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((router: string) => pathname === router);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

// Define protected routes with exact paths and regex patterns
export const commonProtectedRoutes: RouteConfig = {
  exact: ["/change-password", "/my-profile"],
  pattern: [],
};
export const doctorProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/doctor\/dashboard/],
};

export const patientProtectedRoutes: RouteConfig = {
  exact: ["/payment/success"],
  pattern: [/^\/patient\/dashboard/],
};

export const adminProtectedRoutes: RouteConfig = {
  exact: [],
  pattern: [/^\/admin\/dashboard/],
};
//check  matches rotues
export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  //for exact routes
  if (routes.exact.includes(pathname)) {
    return true;
  }
  //for pattern routes
  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};
//find route owner -> role
export const getRouteOwner = (
  pathname: string,
): "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  if (isRouteMatches(pathname, patientProtectedRoutes)) {
    return "PATIENT";
  }
  if (isRouteMatches(pathname, doctorProtectedRoutes)) {
    return "DOCTOR";
  }
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  return null;
};
//get default route for redirect based on role
export const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }
  if (role === "PATIENT") {
    return "/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (redirect: string, role: UserRole) => {
  //unify SUPER_ADMIN and ADMIN role
  const unifySuperAdminAndAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

  role = unifySuperAdminAndAdminRole;

  const routeOwner = getRouteOwner(redirect);

  if (routeOwner === null) {
    return true; // Public route, allow access
  }

  if (routeOwner === "COMMON") {
    return true; // Common protected route, allow access
  }
  if (routeOwner === role) {
    return true;
  }

  return false;
};
