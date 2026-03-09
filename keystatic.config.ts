import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: { owner: 'vespillo-tech', name: 'privacyterminal' },
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
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),

    achievements: collection({
      label: 'Achievements',
      slugField: 'id',
      path: 'src/content/achievements/*',
      format: { data: 'yaml' },
      schema: {
        id: fields.slug({
          name: { label: 'ID', description: 'Achievement key (e.g. FIRST_BOOT)' },
        }),
        name: fields.text({
          label: 'Display Name',
          validation: { isRequired: true },
        }),
        icon: fields.text({
          label: 'Icon',
          description: 'Terminal-style icon (e.g. [*])',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Description',
          validation: { isRequired: true },
        }),
        points: fields.integer({
          label: 'Points',
          defaultValue: 10,
        }),
      },
    }),

    tools: collection({
      label: 'Tools',
      slugField: 'title',
      path: 'src/content/tools/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          validation: { isRequired: true },
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Ready', value: 'ready' },
            { label: 'Coming Soon', value: 'soon' },
          ],
          defaultValue: 'soon',
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 99,
        }),
      },
    }),
  },

  singletons: {
    gameConfig: singleton({
      label: 'Game Config',
      path: 'src/content/site/game-config',
      format: { data: 'yaml' },
      schema: {
        levels: fields.array(
          fields.object({
            level: fields.integer({ label: 'Level Number' }),
            name: fields.text({ label: 'Level Name' }),
            min: fields.integer({ label: 'Min Score' }),
            max: fields.integer({ label: 'Max Score' }),
          }),
          { label: 'Levels', itemLabel: (props) => props.fields.name.value || 'Level' }
        ),
        guide_points: fields.integer({ label: 'Points per Guide', defaultValue: 15 }),
        tool_points: fields.integer({ label: 'Points per Tool', defaultValue: 10 }),
        api_base: fields.url({ label: 'API Base URL' }),
      },
    }),

    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/site/site-settings',
      format: { data: 'yaml' },
      schema: {
        site_name: fields.text({ label: 'Site Name' }),
        version: fields.text({ label: 'Version' }),
        site_url: fields.url({ label: 'Site URL' }),
        default_description: fields.text({ label: 'Default Description', multiline: true }),
        og_image: fields.text({ label: 'OG Image Path' }),
        github_url: fields.url({ label: 'GitHub URL' }),
        security_txt: fields.text({ label: 'Security.txt Path' }),
      },
    }),

    navigation: singleton({
      label: 'Navigation',
      path: 'src/content/site/navigation',
      format: { data: 'yaml' },
      schema: {
        items: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL' }),
            key: fields.text({ label: 'Keyboard Key' }),
          }),
          { label: 'Nav Items', itemLabel: (props) => props.fields.label.value || 'Item' }
        ),
      },
    }),

    homepage: singleton({
      label: 'Homepage',
      path: 'src/content/site/homepage',
      format: { data: 'yaml' },
      schema: {
        hero_cards: fields.array(
          fields.object({
            box_title: fields.text({ label: 'Box Title' }),
            title_color: fields.select({
              label: 'Title Color',
              options: [
                { label: 'Green', value: 'green' },
                { label: 'Cyan', value: 'cyan' },
                { label: 'Amber', value: 'amber' },
              ],
              defaultValue: 'green',
            }),
            heading: fields.text({ label: 'Heading' }),
            description: fields.text({ label: 'Description', multiline: true }),
            cta_text: fields.text({ label: 'CTA Text' }),
            link: fields.text({ label: 'Link URL' }),
          }),
          { label: 'Hero Cards', itemLabel: (props) => props.fields.box_title.value || 'Card' }
        ),
        boot_messages: fields.array(
          fields.object({
            type: fields.text({ label: 'Type (BOOT/INFO/READY)' }),
            text: fields.text({ label: 'Message Text' }),
          }),
          { label: 'Boot Messages', itemLabel: (props) => props.fields.type.value || 'Message' }
        ),
        promises: fields.array(
          fields.object({
            icon: fields.text({ label: 'Icon' }),
            title: fields.text({ label: 'Title' }),
            color: fields.select({
              label: 'Color',
              options: [
                { label: 'Green', value: 'green' },
                { label: 'Cyan', value: 'cyan' },
                { label: 'Amber', value: 'amber' },
              ],
              defaultValue: 'green',
            }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Promises', itemLabel: (props) => props.fields.title.value || 'Promise' }
        ),
        social_proof: fields.text({ label: 'Social Proof Text' }),
      },
    }),

    aboutPage: singleton({
      label: 'About Page',
      path: 'src/content/site/about-page',
      format: { data: 'yaml' },
      schema: {
        what_is_this: fields.array(
          fields.text({ label: 'Paragraph' }),
          { label: 'What Is This Paragraphs', itemLabel: (_props, i) => `Paragraph ${i + 1}` }
        ),
        principles: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Principles', itemLabel: (props) => props.fields.title.value || 'Principle' }
        ),
        transparency: fields.array(
          fields.object({
            key: fields.text({ label: 'Key' }),
            value: fields.text({ label: 'Value' }),
            color: fields.text({ label: 'Color' }),
            link: fields.text({ label: 'Link URL (optional)' }),
          }),
          { label: 'Transparency Items', itemLabel: (props) => props.fields.key.value || 'Item' }
        ),
        verification_steps: fields.array(
          fields.text({ label: 'Step' }),
          { label: 'Verification Steps', itemLabel: (_props, i) => `Step ${i + 1}` }
        ),
        tech_stack: fields.text({ label: 'Tech Stack' }),
      },
    }),

    authCopy: singleton({
      label: 'Auth Copy',
      path: 'src/content/site/auth-copy',
      format: { data: 'yaml' },
      schema: {
        register: fields.object({
          title: fields.text({ label: 'Title' }),
          subtitle_lines: fields.array(
            fields.text({ label: 'Line' }),
            { label: 'Subtitle Lines', itemLabel: (_props, i) => `Line ${i + 1}` }
          ),
          promise: fields.text({ label: 'Promise Text' }),
          create_button: fields.text({ label: 'Create Button Label' }),
          switch_to_login: fields.text({ label: 'Switch to Login Link Text' }),
        }),
        recovery: fields.object({
          title: fields.text({ label: 'Title' }),
          warning: fields.text({ label: 'Warning Text', multiline: true }),
          storage_note: fields.text({ label: 'Storage Note', multiline: true }),
          copy_button: fields.text({ label: 'Copy Button Label' }),
          saved_button: fields.text({ label: 'Saved Button Label' }),
        }),
        login: fields.object({
          title: fields.text({ label: 'Title' }),
          input_placeholder: fields.text({ label: 'Input Placeholder' }),
          prompt: fields.text({ label: 'Prompt Text' }),
          submit_button: fields.text({ label: 'Submit Button Label' }),
          switch_to_register: fields.text({ label: 'Switch to Register Link Text' }),
          error_invalid: fields.text({ label: 'Invalid Code Error' }),
          error_empty: fields.text({ label: 'Empty Input Error' }),
        }),
        loading_text: fields.text({ label: 'Loading Text' }),
      },
    }),
  },
});
