import { auth, currentUser } from "@clerk/nextjs/server";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_UR || "http://localhost:1337";
const strapiApiToken = process.env.STRAPI_API_TOKEN;

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No user found");
    return null;
  }

  if (!strapiApiToken) {
    console.error("Strapi API Token is missiing");
  }

  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  try {
    // Check if the user  in Strapi
    const existingUserResponse = await fetch(
      `${strapiUrl}/api/users?filters[clerkId][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${strapiApiToken}`,
        },
        cache: "no-store",
      },
    );

    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.json();
      console.error("Strapi error response: ", errorText);
      return null;
    }

    const existingUserData = await existingUserResponse.json();

    if (existingUserData.length > 0) {
      const existingUser = existingUserData[0];

      if (existingUser.subscriptionTier !== subscriptionTier) {
        await fetch(`${strapiUrl}/api/users/${existingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${strapiApiToken},`,
          },
          body: JSON.stringify({
            subscriptionTier,
          }),
        });
      }

      return { ...existingUser, subscriptionTier };
    }

    // Create new user in Strapi

    // Get authenticated role
    const rolesResponse = await fetch(
      `${strapiUrl}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${strapiApiToken}`,
        },
      },
    );

    const rolesData = await rolesResponse.json();
    const authenticatedRole = rolesData.roles.find(
      (role) => role.type === "authenticated",
    );

    if (!authenticatedRole) {
      console.error("Authenticated roles not found");
      return null;
    }

    const userData = {
      username:
        user.username || user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      password: `clerk_managed_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: true,
      role: authenticatedRole.id,

      clerkId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      imageUrl: user.imageUrl || "",
      subscriptionTier,
    };

    const newUserResposne = await fetch(`${strapiUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiApiToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!newUserResposne.ok) {
      const errorText = await newUserResposne.text();
      console.error("Error creating user: ", errorText);
      return null;
    }

    const newUser = await newUserResposne.json();
    return newUser;
  } catch (error) {
    console.error("Error is checkUser: ", error);
    return null;
  }
};
