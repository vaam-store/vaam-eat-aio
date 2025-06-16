import { uploadRouter } from '@app/server/api/routers/upload';
import { userRouter } from '@app/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '@app/server/api/trpc';
import { createRouter } from '@gen/routers';

const zenRouter = createRouter();

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  upload: uploadRouter,
  user: userRouter, // Add the new user router
  zen: zenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
