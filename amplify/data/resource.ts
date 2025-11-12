import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== CHAT APPLICATION =====================================================
This schema is currently empty as we don't need database models for the
basic chat interface. The invoke_agent method will be implemented later.
=========================================================================*/
const schema = a.schema({
  // Schema will be expanded when needed for chat history
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
