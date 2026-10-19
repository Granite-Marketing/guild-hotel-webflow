# Webflow IDs Reference

Quick-lookup for site, page, collection, and field IDs to avoid redundant API/MCP calls. **Fill this in for your project on first-run setup.** Several skills (`build-component`, `content-ingest`, `update-seo`, `upload-copy`) read these IDs implicitly; keep this file current as your CMS schema evolves.

## Site

- **Name**: _<your project name>_
- **Site ID**: `REPLACE_ME_SITE_ID`
- **Staging URL**: `your-site.webflow.io`

Look up the Site ID via `mcp__webflow__data_sites_tool` → `list_sites`, or in Webflow Site Settings → General.

## Pages

| Page | ID | Slug |
|---|---|---|
| Home | `REPLACE_ME` | `/` |

Populate via `mcp__webflow__data_pages_tool` → `list_pages`.

## CMS Collections

| Collection | ID | Purpose |
|---|---|---|
| _Example_ | `REPLACE_ME` | Brief description of what the collection holds |

Populate via `mcp__webflow__data_cms_tool` → `get_collection_list`.

## Key CMS Fields

For each collection your skills write to, list the writable fields, their slugs, and types. Reference fields should call out the target collection.

| Field | Slug | Type | Notes |
|---|---|---|---|
| _Example_ | `field-slug` | PlainText | |

## Conventions

- **IDs are 24-char hex** for collections, pages, and items; 32-char hex for option-field option IDs.
- **Slug fields are kebab-case**, generated from the item name unless overridden.
- **Reference fields** store the target item's ID; multi-reference fields store an array of IDs.
- Update this file whenever you add a new collection, page, or field that another skill depends on.
