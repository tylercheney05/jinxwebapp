import { z } from "zod";

export const limitedTimePromoFormSchema = {
    name: z.string().min(1, { message: "Name is required" }),
    is_archived: z.boolean(),
}