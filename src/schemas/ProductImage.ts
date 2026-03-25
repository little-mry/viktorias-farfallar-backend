import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, timestamp } from '@keystone-6/core/fields';
import { cloudinaryImage } from '@keystone-6/cloudinary';

export const ProductImage = list({
  access: allowAll,

  hooks: {
    resolveInput: async ({ resolvedData, context }) => {
      if (resolvedData.product?.connect?.id) {
        const product = await context.query.Product.findOne({
          where: { id: resolvedData.product.connect.id },
          query: 'name breed',
        });
        if (product) {
          resolvedData.altText = `${product.name} - ${product.breed}`;
        }
      }
      return resolvedData;
    },
  },

  fields: {
    image: cloudinaryImage({
      label: 'Bild',
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
        apiKey: process.env.CLOUDINARY_API_KEY!,
        apiSecret: process.env.CLOUDINARY_API_SECRET!,
        folder: 'viktorias-fallar',
      },
    }),

    altText: text({
      label: 'Bildtext',
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),

    product: relationship({
      label: 'Produkt',
      ref: 'Product.images',
    }),

    createdAt: timestamp({
      label: 'Uppladdad',
      defaultValue: { kind: 'now' },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
