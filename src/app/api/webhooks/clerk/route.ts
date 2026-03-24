import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req:Request) {
    // get svix headers
    const headerPayload = await headers();

    const svix_id = headerPayload.get("svix_id");
    const svix_timestamp = headerPayload.get("svix_timestamp");
    const svix_signature = headerPayload.get("svix_signature");

    // check if svix headers are present

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing svix headers', {status: 400});
    }

    // parse body
    const payload = await req.json();

    // verify webhooks 
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    const body = JSON.stringify(payload)

    if (!webhookSecret) {
        return new Response('Error: Missing webhook secret', {status: 500});
    }

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

   try {
    evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
    }) as WebhookEvent;
   } catch (error) {
        return new Response('Error: invalid webhook signature', {status: 400});
   }

    // handle specific events
    const eventType = evt.type;
    if (eventType === 'user.created' || eventType == 'user.updated') {
        const {id, email_addresses, first_name, last_name, phone_numbers, image_url} = evt.data;

        try {
            await connectDB()

            await User.findOneAndUpdate({clerkId: id}, {
                clerkId: id,
                email: email_addresses[0].email_address,
                firstName: first_name,
                lastName: last_name,
                phoneNumber: phone_numbers,
                imageUrl: image_url,
            }, {
                upsert: true,
                new: true,
            })
        } catch (error) {
            return new Response('Error: syncing user to database', {status: 500});
        }
    }

    return new Response('Webhook received', {status: 200})
}