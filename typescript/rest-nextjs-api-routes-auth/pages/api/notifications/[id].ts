import type { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';

// DELETE /api/notifications/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const notificationId = req.query.id;

  //memo: next-authのgetSessionだとうまく動かなかった
  // https://next-auth.js.org/configuration/nextjs#in-api-routes
  const session = await getServerSession(req, res, options);

  if (req.method === "DELETE") {
    if (session) {
      const notification = await prisma.notifications.delete({
        where: { id: Number(notificationId) },
      });
      res.json(notification);
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
