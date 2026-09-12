import { serve } from "@upstash/workflow/express";
import Subscription from "../model/subscriptionModel.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-mail.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  if (!context.requestPayload) {
    console.error("Request payload is undefined.");
    return;
  }

  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") {
    console.log(
      `Subscription ${subscriptionId} is not active or not found.`
    );
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}.`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `${daysBefore} days before reminder`,
        reminderDate
      );
    }

    if(dayjs().isSame(reminderDate,"day")){

      await triggerReminder(
      context,
      `${daysBefore} days before reminder`,
      subscription
    );
    }
    
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    const sub = await Subscription.findById(subscriptionId)
      .populate("user", "name email")
      .lean();

    return sub;
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(
    `Sleeping until ${label} reminder at ${date}`
  );
  await context.sleepUntil(label, date.toDate());

//  await context.sleep(label, "10s"); ==> for testing purposes, you can use this line instead of the one above to sleep for 10 seconds
};

const triggerReminder = async (
  context,
  label,
  daysBefore,
  subscription
) => {
  return await context.run(label, async () => {
    console.log(
      `Triggering ${label} for ${subscription.user.email}`
    );

    const result = await sendReminderEmail({
      to: subscription.user.email,

      // THIS MUST MATCH email-template.js
      type: `${daysBefore} days before reminder`,

      subscription,
    });

    console.log("Email sent:", result.response);

    return result;
  });
};