// pages/api/stripe/balance.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const balance = await stripe.balance.retrieve()
      res.status(200).json(balance)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).end() // Method Not Allowed
  }
}
