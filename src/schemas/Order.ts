import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, timestamp, select, integer, json } from '@keystone-6/core/fields';

export const Order = list({
  access: allowAll,

  fields: {
    orderNumber: text({
      label: 'Ordernummer',
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),

    customerName: text({
      label: 'Kundnamn',
      validation: { isRequired: true },
    }),

    customerEmail: text({
      label: 'E-post',
      validation: { isRequired: true },
    }),

    customerPhone: text({
      label: 'Telefon',
    }),

    shippingAddress: json({
      label: 'Leveransadress',
    }),

    orderItems: json({
      label: 'Orderrader',
    }),

    totalAmount: integer({
      label: 'Totalt belopp (kr)',
      validation: { isRequired: true },
    }),

    stripePaymentIntentId: text({
      label: 'Stripe betalnings-ID',
      ui: { itemView: { fieldMode: 'read' } },
    }),

    status: select({
      label: 'Status',
      options: [
        { label: 'Väntar', value: 'pending' },
        { label: 'Betald', value: 'paid' },
        { label: 'Skickad', value: 'shipped' },
        { label: 'Avslutad', value: 'completed' },
        { label: 'Avbruten', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      validation: { isRequired: true },
    }),

    createdAt: timestamp({
      label: 'Skapad',
      defaultValue: { kind: 'now' },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),

    paidAt: timestamp({
      label: 'Betald',
      ui: { itemView: { fieldMode: 'read' } },
    }),

    shippedAt: timestamp({
      label: 'Skickad',
      ui: { itemView: { fieldMode: 'read' } },
    }),
  },
});
