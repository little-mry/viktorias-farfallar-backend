import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  relationship,
  timestamp,
  select,
  integer,
  checkbox,
} from "@keystone-6/core/fields";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const Product = list({
  access: allowAll,

  hooks: {
    resolveInput: ({ resolvedData }) => {
      if (resolvedData.name && !resolvedData.slug) {
        resolvedData.slug = toSlug(resolvedData.name as string);
      }
      return resolvedData;
    },
  },

  fields: {
    name: text({
      label: 'Namn',
      validation: { isRequired: true },
    }),

    slug: text({
      label: 'Slug (URL)',
      isIndexed: "unique",
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),

    price: integer({
      label: 'Pris (kr)',
      validation: { isRequired: true },
    }),

    breed: text({
      label: 'Ras',
      validation: { isRequired: true },
    }),

    size: select({
      label: 'Storlek',
      options: [
        { label: "Liten (90-100 cm)", value: "small" },
        { label: "Mellan (100-110 cm)", value: "medium" },
        { label: "Stor (110+ cm)", value: "large" },
      ],
      validation: { isRequired: true },
    }),

    grade: select({
      label: 'Sortering',
      options: [
        { label: "A-sortering", value: "a-grade" },
        { label: "Andrahandssortering", value: "second-hand" },
      ],
      validation: { isRequired: true },
    }),

    inStock: checkbox({
      label: 'I lager',
      defaultValue: true,
    }),

    published: checkbox({
      label: 'Publicerad',
      defaultValue: false,
    }),

    images: relationship({
      label: 'Bilder',
      ref: "ProductImage.product",
      many: true,
    }),

    createdAt: timestamp({
      label: 'Skapad',
      defaultValue: { kind: "now" },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
