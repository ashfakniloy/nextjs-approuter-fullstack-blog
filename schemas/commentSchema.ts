import { z } from "zod";

export const commentSchema = z.object({
  comment: z
    .string()
    .nonempty("Comment is required")
    .refine((value) => value.trim().length > 0, "Comment can't be empty"),
});

export const commentReplySchema = z.object({
  commentReply: z
    .string()
    .nonempty("Comment reply is required")
    .refine((value) => value.trim().length > 0, "Comment reply can't be empty"),
});

export type CommentFormProps = z.infer<typeof commentSchema>;
export type CommentReplyProps = z.infer<typeof commentReplySchema>;
