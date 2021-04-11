// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    return context;
  };
}; */

/* This validation code includes:

A check if there is a text in the data and throws an error if not
Truncate the message's text property to 400 characters
Update the data submitted to the database to contain:
The new truncated text
The currently authenticated user id (so we always know who sent it)
The current (creation) date
# */

export default () : Hook => {
  return async (context: HookContext) => {
    const { data } = context;

    // Throw an error if we didn't get a text
    if(!data.text) {
      throw new Error('A message must have a text');
    }

    // The authenticated user
    const user = context.params.user;
    // The actual message text
    const text = data.text
      // Messages can't be longer than 400 characters
      .substring(0, 400);

    // Override the original data (so that people can't submit additional stuff)
    context.data = {
      text,
      // Set the user id
      userId: user!._id,
      // Add the current date
      createdAt: new Date().getTime()
    };

    // Best practice: hooks should always return the context
    return context;
  };
}

// in this hook we are currently just adding the user's _id as the userId property in the message. We want to show more information about the user that sent it in the UI, so we'll need to populate more data in the message response.