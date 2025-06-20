# Very important

- this project uses yarn. Never run npm here
- Never implement a tRPC unless tasked to. Use instead generated tRPC code from "@gen" (unlikely) or check the @/src/server/api/root.ts and use the "zen" route first. It contains tRPC generated code from the @/schema.zmodel file.
- always use border card, never shadow-xl
- never put a card inside another one
- before implementing a feature, check if it's not present already in the future stage of the IMPLEMENTATION_ROADMAP.md. If it's present on a previous or checked stage, then maybe it's done already. If not, maybe you'll want to ask the user if he want to first update the roadmap before.
- Never use the "db" object, unless instructed otherwise. Use instead server trpc client.
- Prefer using nullish coalescing operator (`??`) instead of a logical or (`||`), as it is a safer operator.
