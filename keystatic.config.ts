import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Privacy Terminal',
    },
  },
  collections: {
    guides: collection({
      label: 'Guides',
      slugField: 'title',
      path: 'src/content/guides/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Foundations', value: 'foundations' },
            { label: 'Essentials', value: 'essentials' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
          defaultValue: 'foundations',
        }),
        order: fields.integer({
          label: 'Order',
          defaultValue: 0,
          description: 'Display order within the category (lower = first)',
        }),
        publishedDate: fields.date({
          label: 'Published Date',
        }),
        updatedDate: fields.date({
          label: 'Updated Date',
        }),
        readingTime: fields.text({
          label: 'Reading Time',
          description: 'e.g. "8 min read"',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.value || 'New Tag',
          }
        ),
        relatedTools: fields.array(
          fields.text({ label: 'Tool Slug' }),
          {
            label: 'Related Tools',
            itemLabel: (props) => props.value || 'New Tool',
            description: 'Slugs of related tools (e.g. fingerprint-analyzer)',
          }
        ),
        relatedGuides: fields.array(
          fields.text({ label: 'Guide Slug' }),
          {
            label: 'Related Guides',
            itemLabel: (props) => props.value || 'New Guide',
            description: 'Slugs of related guides',
          }
        ),
        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
          description: 'Draft guides are not published to the live site',
        }),
        content: fields.markdoc({
          label: 'Content',
        }),
      },
    }),
  },
});
