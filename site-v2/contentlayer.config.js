import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Article = defineDocumentType(() => ({
  name: "Article",
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: "string",
      description: "The title of the article",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the article",
      required: true,
    },
    published: {
      type: "date",
      description: "The date of the article",
      required: true,
    },
    tags: {
      type: "list",
      of: { type: "string" },
      description: "The tags of the article",
      required: true,
    },
    images: {
      type: "list",
      of: { type: "string" },
      description: "The images of the article",
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (article) => article._raw.flattenedPath,
    },
    url: {
      type: "string",
      resolve: (article) => `/blog/${article._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "blog",
  documentTypes: [Article],
});
