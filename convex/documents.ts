import {v} from 'convex/values';

import {mutation, query} from './_generated/server';
import {Doc, Id} from './_generated/dataModel';

export const get = query({
    handler: async(ctx) => {
        const identiy = await ctx.auth.getUserIdentity();

        if(!identiy){
            throw new Error("Not authenticated");
        }

        const documents = await ctx.db.query("documents").collect();
        return documents;
    }
});

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identiy = await ctx.auth.getUserIdentity();

        if(!identiy){
            throw new Error("Not authenticated");
        }

        const userId = identiy.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId: userId,
            isArchived: false,
            isPublished: false
        });

        return document;
    }
})