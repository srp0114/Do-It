import type { NextApiRequest, NextApiResponse } from 'next';

interface PostTodo {
  name: string;
}

interface PostResponse {
  isCompleted: boolean;
  imageUrl: string | null;
  memo: string | null;
  name: string;
  tenantId: string;
  id: number;
}

interface GetResponse {
  id: number;
  name: string;
  isCompleted: boolean;
}

const itemsStore: { [key: string]: { id: number; name: string; isCompleted: boolean }[] } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse | GetResponse[] | { error: string }>
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

      const newItem = {
        id: Date.now(), 
        name,
        isCompleted: false,
      };

      if (!itemsStore[tenantId as string]) {
        itemsStore[tenantId as string] = [];
      }
      itemsStore[tenantId as string].push(newItem);

      res.status(200).json({
        isCompleted: false,
        imageUrl: null,
        memo: null,
        name: newItem.name,
        tenantId: tenantId as string,
        id: newItem.id,
      });
      break;

    case 'GET':
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      // Get all items for the tenant
      const items = itemsStore[tenantId as string] || [];
      res.status(200).json(items);
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
