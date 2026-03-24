// @\features\auth\actions.ts
import { CreateSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
  try {
    const { account } = await CreateSessionClient();
    return await account.get();
  } catch {
    return null;
  }
};
