/**
 * This file defines the API routes responsible for managing "workspaces"
 * in the application. A workspace is a collaborative environment where
 * users (members) can work together.
 *
 * The routes are implemented using the Hono framework. Each route handles
 * a specific operation related to workspaces:
 *
 * 1. GET "/"          -> Get all workspaces that the current user belongs to
 * 2. POST "/"         -> Create a new workspace
 * 3. PATCH "/:id"     -> Update a workspace (only allowed for admins)
 * 4. DELETE "/:id"    -> Delete a workspace (only allowed for admins)
 *
 * The file also:
 * - Validates incoming data using Zod
 * - Uses sessionMiddleware to ensure the user is authenticated
 * - Uses Appwrite databases to store workspace and member data
 * - Uses Appwrite storage to store uploaded workspace images
 * - Uses a helper function (getMember) to verify workspace permissions
 */

import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { zValidator } from "@hono/zod-validator"; // Used to validate incoming request data using Zod schemas
import { Hono } from "hono"; // Web framework used to define API routes
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas"; // Validation rules for creating and updating workspaces
import { sessionMiddleware } from "@/lib/sessionMiddleware"; // Middleware that authenticates the user and attaches user info to the request context
import { DATABASE_ID, IMAGES_BUCKET_ID } from "@/app/config"; // Application configuration values
import { ID, Query } from "node-appwrite"; // Utilities from Appwrite SDK
import { MemberRole } from "@/features/members/type"; // Enum defining different member roles (ADMIN, MEMBER etc.)
import { generateInviteCode } from "@/lib/utils"; // Utility that generates a random invite code
import { getMember } from "@/features/members/utils"; // Helper function that retrieves a user's membership in a workspace
import z from "zod";
import { Workspace } from "../types";
import { TaskStatus } from "@/features/tasks/types";

// Create a new Hono application instance where routes will be defined
const app = new Hono()
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      "workspaces",
      workspaceId,
    );

    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      "workspaces",
      workspaceId,
    );

    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })
  .get("/", sessionMiddleware, async (c) => {
    // Get Appwrite database client from the request context
    const databases = c.get("databases");

    // Get the authenticated user object from the session middleware
    const user = c.get("user");

    // Step 1: find all membership records for the current user
    const members = await databases.listDocuments(DATABASE_ID, "members", [
      Query.equal("userId", user.$id), // Only members belonging to this user
    ]);

    // If the user is not part of any workspace, return an empty response
    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    // Extract workspace IDs from the member documents
    const workspaceIds = members.documents.map((member) => member.workspaceId);

    // Step 2: retrieve the workspaces that match those IDs
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      "workspaces",
      [
        Query.orderDesc("$createdAt"), // Sort newest workspaces first
        Query.contains("$id", workspaceIds), // Only workspaces that match the user's memberships
      ],
    );

    // Return the workspaces to the client
    return c.json({ data: workspaces });
  })

  /**
   * POST "/"
   *
   * Purpose:
   * Create a new workspace.
   *
   * Process:
   * 1. Validate the request body using Zod schema
   * 2. Ensure the user is authenticated
   * 3. Upload workspace image (if provided)
   * 4. Create workspace document in the database
   * 5. Create a membership record for the creator as ADMIN
   */
  .post(
    "/",

    // Validate incoming form data using the createWorkspaceSchema
    zValidator("form", createWorkspaceSchema),

    // Ensure the user is authenticated
    sessionMiddleware,

    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      // Extract validated form fields
      const { name, imageUrl } = c.req.valid("form");

      // Variable that will store the final image data
      let uploadedImageUrl: string | undefined;

      // If the user uploaded an image file
      if (imageUrl instanceof File) {
        // Upload the file to Appwrite storage
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          imageUrl,
        );

        // Download the file again to convert it to a base64 format
        const arrayBuffer = await storage.getFileDownload(
          IMAGES_BUCKET_ID,
          file.$id,
        );

        // Convert the file to base64 so it can be used directly in the frontend
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      }

      // Create the workspace document in the database
      const workspace = await databases.createDocument(
        DATABASE_ID,
        "workspaces",
        ID.unique(),
        {
          name,
          userId: user.$id, // creator
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6), // generate a 6 character invite code
        },
      );

      // Create a member record giving the creator ADMIN permissions
      await databases.createDocument(DATABASE_ID, "members", ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      // Return the created workspace
      return c.json({ data: workspace });
    },
  )

  /**
   * PATCH "/:workspaceId"
   *
   * Purpose:
   * Update an existing workspace.
   *
   * Important rule:
   * Only workspace ADMINs are allowed to update workspace information.
   *
   * Process:
   * 1. Authenticate user
   * 2. Validate request data
   * 3. Verify user is a member of the workspace
   * 4. Verify the user has ADMIN role
   * 5. Upload new image if provided
   * 6. Update workspace document
   */
  .patch(
    "/:workspaceId",

    sessionMiddleware,

    zValidator("form", updateWorkspaceSchema),

    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();

      const { name, imageUrl } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;

      if (imageUrl instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          imageUrl,
        );

        const arrayBuffer = await storage.getFileDownload(
          IMAGES_BUCKET_ID,
          file.$id,
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        "workspaces",
        workspaceId,
        {
          name,
          ...(uploadedImageUrl !== undefined
            ? { imageUrl: uploadedImageUrl }
            : {}),
        },
      );

      return c.json({ data: workspace });
    },
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, "workspaces", workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      "workspaces",
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      },
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        "workspaces",
        workspaceId,
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, "members", ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });
      return c.json({ data: workspace });
    },
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(DATABASE_ID, "tasks", [
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
    ]);
    const lastMonthTasks = await databases.listDocuments(DATABASE_ID, "tasks", [
      Query.equal("workspaceId", workspaceId),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
    ]);

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const completedTaskCount = thisMonthCompletedTasks.total;
    const completeTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      "tasks",
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    );

    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTaskDifference =
      overdueTaskCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        completedTaskCount,
        completeTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    });
  });

export default app;
