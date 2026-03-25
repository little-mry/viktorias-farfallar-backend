import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, checkbox, timestamp } from '@keystone-6/core/fields';

export const Page = list({
  access: allowAll,

  fields: {
    title: text({
      label: 'Titel',
      validation: { isRequired: true },
    }),

    slug: text({
      label: 'Slug (URL)',
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),

    content: text({
      label: 'Innehåll',
      ui: { displayMode: 'textarea' },
    }),

    published: checkbox({
      label: 'Publicerad',
      defaultValue: false,
    }),

    updatedAt: timestamp({
      label: 'Uppdaterad',
      defaultValue: { kind: 'now' },
      db: { updatedAt: true },
      ui: { itemView: { fieldMode: 'read' } },
    }),
  },
});
