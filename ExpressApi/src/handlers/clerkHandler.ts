import {Request, Response} from "express";
import prisma from "../db";
import { Webhook } from "svix";
import dotenv from "dotenv";

dotenv.config();

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

dotenv.config();
export const onboardUser = async (req: Request, res: Response) => {
   const svix_id = Array.isArray(req.headers["svix-id"])
    ? req.headers["svix-id"][0]
    : req.headers["svix-id"];
  const svix_timestamp = Array.isArray(req.headers["svix-timestamp"])
    ? req.headers["svix-timestamp"][0]
    : req.headers["svix-timestamp"];
  const svix_signature = Array.isArray(req.headers["svix-signature"])
    ? req.headers["svix-signature"][0]
    : req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send("Error: No Svix headers");
  }

  const payload = req.body;
  const body = payload.toString();

  if (!WEBHOOK_SECRET) {
    throw new Error("No secret found")
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let event;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }

  const { id: eventId, type: eventType, data: clerkUser } = event as any;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = clerkUser;

    const primaryEmail = email_addresses[0]?.email_address;

    const fullName =
      first_name && last_name
        ? `${first_name} ${last_name}`
        : first_name || last_name || "New User";

    try {
      await prisma.user.create({
        data: {
          id: id,
          name: fullName,
          email: primaryEmail,
          onboardingComplete: false,
        },
      });
      return res.status(200).json({ success: true, message: "User onboarded" });
    } catch (dbError: any) {
      console.error("Error onboarding user:", dbError);
      if (dbError.code === "P2002") {
        return res.status(200).json({
          success: true,
          message: "User already exists or duplicate event.",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to onboard user due to a database error.",
        error: dbError,
      });
    }
  } else if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = clerkUser;
    const primaryEmail = email_addresses[0]?.email_address;
    const fullName =
      first_name && last_name
        ? `${first_name} ${last_name}`
        : first_name || last_name || "New User";

    try {
      await prisma.user.update({
        where: { id: id },
        data: {
          name: fullName,
          email: primaryEmail,
        },
      });
      return res.status(200).json({ success: true, message: "User updated" });
    } catch (updateError) {
      console.error("Error updating user:", updateError);
      return res.status(500).json({
        success: false,
        message: "Failed to update user due to a database error.",
        error: updateError,
      });
    }
  } else {
    return res
      .status(200)
      .json({ success: true, message: "Event received, no action taken" });
  }
};
