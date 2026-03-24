/**
 * This file contains a helper function used to find a specific member
 * inside a workspace from the Appwrite database.
 *
 * In this application, a "member" represents a user who belongs to a
 * specific workspace. Since a user can belong to many workspaces,
 * we must search the database using BOTH:
 * - the workspaceId
 * - the userId
 *
 * The function queries the "members" collection in the Appwrite database
 * and returns the matching member document.
 *
 * This is commonly used when the application needs to:
 * - check if a user belongs to a workspace
 * - get the user's role or permissions inside that workspace
 */

import { Query, type Databases } from "node-appwrite";
import { DATABASE_ID } from "@/app/config";


// Defines the structure of the data required to run the getMember function
interface GetMemberProps {
  databases: Databases;   // Appwrite database client used to perform queries
  workspaceId: string;    // The workspace we want to search in
  userId: string;         // The user we want to check inside that workspace
}


// Function that retrieves a specific workspace member
export const getMember = async ({
  databases,
  workspaceId,
  userId
}: GetMemberProps) => {

  // Query the "members" collection in the database
  const members = await databases.listDocuments(
    DATABASE_ID,          // The database ID defined in the config
    "members",            // The collection where member records are stored
    [
      // Filter: only return documents where workspaceId matches
      Query.equal("workspaceId", workspaceId),

      // Filter: only return documents where userId matches
      Query.equal("userId", userId)
    ]
  )

  // The query returns a list of documents.
  // Since a user should only appear once per workspace,
  // we return the first document in the results.
  return members.documents[0]
}
