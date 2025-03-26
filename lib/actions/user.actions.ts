"use server";

import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ Correct

import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import type { User } from "@clerk/backend"; // Ensure correct Clerk user type



export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient.users.getUserList({
      emailAddress: userIds,
    });

    const users: { id: string; name: string; email: string; avatar: string }[] = data.map((user: User) => ({
      id: user.id,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      avatar: user.imageUrl,
    }));

    const sortedUsers = userIds.map((email) =>
      users.find((user) => user.email === email) || null
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    console.error(`Error fetching users:`, error);
    return null;
  }
};

export const getDocumentUsers = async ({
    roomId,
    currentUser,
    text,
  }: {
    roomId: string;
    currentUser: string;
    text: string;
  }) => {
    try {
      const room = await liveblocks.getRoom(roomId);
  
      const users = Object.keys(room.usersAccesses)
        .filter((email) => email !== currentUser)
        .map((email) => ({
          email,
          accessLevels: room.usersAccesses[email], // Returns the full array of permissions
        }));
  
      return users;
    } catch (error) {
      console.error(`Error fetching document users:`, error);
      return [];
    }
  };
  
