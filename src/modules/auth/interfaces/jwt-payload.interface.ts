export interface JwtPayload {
  sub: string;
  email?: string;
  // It's a senior practice to extend payload interfaces appropriately
  // You can easily add more fields here when you sign the token, e.g., roles.
  iat?: number;
  exp?: number;
}
