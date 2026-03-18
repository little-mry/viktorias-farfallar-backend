import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, checkbox, timestamp, integer } from '@keystone-6/core/fields';

export const lists = {
  Product: list({
    access: allowAll,
    
    fields: {
      name: text({ 
        validation: { isRequired: true } 
      }),
      
      price: integer({
        validation: { isRequired: true },
      }),
      
      inStock: checkbox({ 
        defaultValue: true 
      }),
      
      createdAt: timestamp({ 
        defaultValue: { kind: 'now' } 
      }),
    },
  }),
};