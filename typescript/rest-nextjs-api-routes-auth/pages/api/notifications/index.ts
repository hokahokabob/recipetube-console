import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
import { NotificationProps } from '../../../components/Notification';

// GET /api/notifications
// POST /api/notifications
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, options);
  if (session) {
    if (req.method === "GET") {
      const result = await prisma.notifications.findMany({
        //all
      })
      res.json(result)
    }
    if(req.method === "POST") {
      const { title, content, notification_div, important, start_at, end_at } = req.body;
      const result = await prisma.notifications.create({
        data: {
          title: title,
          content: content,
          notification_div: notification_div,
          important: important === 'on',
          start_at: extractISO8601Date(start_at),
          end_at: extractISO8601Date(end_at),
        }
      })
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
