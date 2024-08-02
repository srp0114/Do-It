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
  imageUrl: string | null;
  memo: string | null;
  tenantId: string;
}

interface PatchTodo {
  isCompleted: boolean;
}

const itemsStore: { [key: string]: { id: number; name: string; isCompleted: boolean; imageUrl: string | null; memo: string | null; tenantId: string }[] } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse | GetResponse[] | { error: string }>
) {
  const {
    query: { tenantId, itemId },
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
        imageUrl: null,
        memo: null,
        tenantId: tenantId as string
      };

      if (!itemsStore[tenantId as string]) {
        itemsStore[tenantId as string] = [];
      }
      itemsStore[tenantId as string].push(newItem);

      res.status(200).json({
        isCompleted: newItem.isCompleted,
        imageUrl: newItem.imageUrl,
        memo: newItem.memo,
        name: newItem.name,
        tenantId: newItem.tenantId,
        id: newItem.id,
      });
      break;

    case 'GET':
      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      // Get all items for the tenant
      const items = itemsStore[tenantId as string] || [];
      res.status(200).json(items.map(item => ({
        id: item.id,
        name: item.name,
        isCompleted: item.isCompleted,
        imageUrl: item.imageUrl,
        memo: item.memo,
        tenantId: item.tenantId
      })));
      break;

    case 'PATCH':
      const { isCompleted }: PatchTodo = body;

      if (typeof isCompleted !== 'boolean') {
        return res.status(400).json({ error: 'isCompleted must be a boolean' });
      }

      if (!tenantId || !itemId) {
        return res.status(400).json({ error: 'Tenant ID and Item ID are required' });
      }

      const tenantItems = itemsStore[tenantId as string];
      if (!tenantItems) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      const itemIndex = tenantItems.findIndex(item => item.id === Number(itemId));
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
      }

      // Update the item
      tenantItems[itemIndex].isCompleted = isCompleted;

      // Return the updated item in PostResponse format
      res.status(200).json({
        isCompleted: tenantItems[itemIndex].isCompleted,
        imageUrl: tenantItems[itemIndex].imageUrl,
        memo: tenantItems[itemIndex].memo,
        name: tenantItems[itemIndex].name,
        tenantId: tenantItems[itemIndex].tenantId,
        id: tenantItems[itemIndex].id,
      });
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET', 'PATCH']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
