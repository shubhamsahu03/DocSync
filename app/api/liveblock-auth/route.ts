import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "Email address not found" },
        { status: 400 }
      );
    }

    const user = {
      id,
      info: {
        id,
        name: `${firstName || ''} ${lastName || ''}`.trim() || email,
        email,
        avatar: imageUrl,
        color: getUserColor(id),
      }
    };

    const { status, body } = await liveblocks.identifyUser(
      {
        userId: user.info.email,
        groupIds: [], // You can add group IDs if needed
      },
      { userInfo: user.info }
    );

    return new NextResponse(body, { status });

  } catch (error) {
    console.error("Liveblocks auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}