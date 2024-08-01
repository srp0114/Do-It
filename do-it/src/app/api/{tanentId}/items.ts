import type { NextApiRequest, NextApiResponse } from 'next';

interface PostTodo {
  name: string;
}

interface ApiResponse {
  isCompleted: boolean;
  imageUrl: string | null;
  memo: string | null;
  name: string;
  tenantId: string;
  id: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {
  const {
    query: { tenantId },
    method,
    body,
  } = req;

  switch (method) {
    case 'POST':
      const { name }: PostTodo = body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      res.status(200).json({
        isCompleted: true,
        imageUrl: null,
        memo: null,
        name: name,
        tenantId: tenantId as string,
        id: 1,
      });
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
