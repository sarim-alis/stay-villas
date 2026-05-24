import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks
// POST /api/stripe
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    console.log('Processing payment_intent.succeeded for:', paymentIntentId);

    // Getting Session Metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { bookingId } = session.data[0].metadata;

    console.log('Updating booking:', bookingId, 'to paid status');

    // Mark Payment as Paid
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId, 
      { isPaid: true, paymentMethod: "Stripe", status: "Completed" },
      { new: true }
    );

    console.log('Booking updated successfully:', updatedBooking?._id, 'isPaid:', updatedBooking?.isPaid, 'status:', updatedBooking?.status);
  } else if (event.type === "charge.updated") {
    const charge = event.data.object;
    const chargeId = charge.id;

    console.log('Processing charge.updated for:', chargeId, 'Status:', charge.status);

    // Check if charge is successful/paid
    if (charge.status === "succeeded" && charge.paid === true) {
      // Getting Session Metadata from payment_intent
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: charge.payment_intent,
      });

      if (session.data.length > 0) {
        const { bookingId } = session.data[0].metadata;

        console.log('Updating booking:', bookingId, 'to paid status via charge.updated');

        // Mark Payment as Paid
        const updatedBooking = await Booking.findByIdAndUpdate(
          bookingId, 
          { isPaid: true, paymentMethod: "Stripe", status: "Completed" },
          { new: true }
        );

        console.log('Booking updated successfully:', updatedBooking?._id, 'isPaid:', updatedBooking?.isPaid, 'status:', updatedBooking?.status);
      } else {
        console.log('No session found for payment_intent:', charge.payment_intent);
      }
    } else {
      console.log('Charge not succeeded yet. Status:', charge.status, 'Paid:', charge.paid);
    }
  } else {
    console.log("Unhandled event type :", event.type);
  }

  response.json({ received: true });
};
