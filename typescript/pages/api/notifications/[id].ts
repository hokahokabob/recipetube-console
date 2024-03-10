import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';

// DELETE /api/notifications/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const notificationId = req.query.id as string;

  //memo: next-authのgetSessionだとうまく動かなかった
  // https://next-auth.js.org/configuration/nextjs#in-api-routes
  const session = await getServerSession(req, res, options);

  if (req.method === "DELETE") {
    if (session) {
      const result = await fetch(process.env.API_URL + `/${notificationId}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": process.env.API_KEY,

          // used for AWS Lambda
          // "X-Function-Name": "notification/delete",
          // "X-Target-Notification-Id": notificationId,

          //TODO: extract google user info from next authentication
          "X-Id-Token": "kusonamoon",
          "X-Dev-Google-Usr": "11111111111",

          "X-Password": req.body.password,
        },
      }).then(
        (res) => res.json()
      )
      res.json(result)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
