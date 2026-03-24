/**
 * This file defines a small custom React hook used to retrieve
 * the invite code from the current page URL.
 *
 * In Next.js App Router, dynamic route values are accessed using
 * the `useParams()` hook from `next/navigation`.
 *
 * Example URL structure:
 * 
 * /workspaces/invite/ABC123
 *
 * In this case:
 * inviteCode = "ABC123"
 *
 * This hook simply extracts that value from the URL parameters
 * and returns it so components can easily access it.
 *
 * Why this hook exists:
 * Instead of repeating `useParams()` and manually reading
 * `params.inviteCode` in many components, we centralize the
 * logic into one reusable hook.
 */

import { useParams } from "next/navigation"; // Hook used to access dynamic route parameters in Next.js

export const useInviteCode = () => {

  // Retrieves all dynamic parameters from the current route
  const params = useParams();

  /**
   * Example of params object depending on route structure:
   *
   * Route file:
   * /app/workspaces/invite/[inviteCode]/page.tsx
   *
   * params would look like:
   * {
   *   inviteCode: "ABC123"
   * }
   */

  // Extract the inviteCode from the params object
  // "as string" tells TypeScript that this value will be a string
  return params.inviteCode as string;
}
