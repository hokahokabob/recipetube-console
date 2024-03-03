import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';

// memo: 色々あってAPI Gatewayを使うことになったため、pages/api以下を挟む必要はないが
// 学習の証跡の兼ねてここに一部の実装を残している
// GET /api/notifications
// POST /api/notifications
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, options);
  if (session) {
    if(req.method === "POST") {
      const result = await fetch(process.env.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.API_KEY,
          "X-Function-Name": "notification/add"
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
