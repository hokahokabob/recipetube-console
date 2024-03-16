import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';

// GET /api/notifications
// POST /api/notifications
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, options);
  if (session) {
    const idToken = await getToken({ req });
    if(req.method === "POST") {
      const result = await fetch(process.env.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.API_KEY,

          // used for AWS Lambda
          // "X-Function-Name": "notification/add",
          
          "X-Admin-Google-Usr": idToken?.email,
          "X-Password": req.body.password,
        },
        body: JSON.stringify(req.body),
      }).then(
        (res) => res.json()
      )
      res.json(result);
    }
  }
  res.status(401).send({ message: 'Unauthorized' })
}

//converts date string like "2024-02-15T19:00" to ISO8601
function extractISO8601Date(dateStr: string): string {
  let date = new Date(dateStr);
  return date.toISOString();
}
