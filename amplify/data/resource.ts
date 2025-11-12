import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== CHAT APPLICATION =====================================================
This schema contains a placeholder model to satisfy TypeScript.
The actual agent functionality will be implemented later.
=========================================================================*/
const schema = a.schema({
  // Placeholder model - not used by the chat interface
  // This exists only to satisfy TypeScript type requirements
  ChatPlaceholder: a
    .model({
      placeholder: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
