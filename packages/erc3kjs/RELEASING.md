# Releasing an Aragon Connect version

This document describes the process to follow when releasing a [stable](#stable-releases) or [unstable](#unstable-releases) version of Connect.

## Stable releases

Stable releases are published under the `@latest` tag on npm, which is the default.

### Prepare the release notes

[Create a new draft release](https://github.com/aragon/connect/releases/new) and write the complete changelog for this version. Ideally this should be done before publishing on npm, so that there is no delay between the release on npm and the announcement.

### Check that everything is ready

```console
yarn oao status
```

Here you want to verify the current versions, and that private packages are marked as such so they don’t get published by mistake (especially for the examples).

### Run the publication script

```console
yarn publish-version
```

This script will:

- Build Connect.
- Run the tests.
- Generate the README files.
- Publish the packages on npm.
- Generate a branch corresponding to the version tag.
- Push `master`, the version branch and the version tag to GitHub.

### Manual tasks on GitHub and GitBook

GitBook doesn’t support git tags, this is why a branch corresponding to the version tag gets created by the `publish-version` script. We now need to do two things: protect the branch on GitHub, and reorder the versions menu on GitBook.

Protect the branch on GitHub:

- Open [the branch settings](https://github.com/aragon/connect/settings/branches) on GitHub.
- Click on the “Add rule” button.
- Put the exact branch name in “Branch name pattern”.
- Click on the “Create” button.

Reorder the menu in GitBook:

- Go to [the GitBook admin page](https://app.gitbook.com/@aragon-one/s/connect/).
- Open the versions menu (it should be on “latest” by default).
- Drag and drop the new version so that it is right below “latest”.
- Click on the “Save” button, then “Merge”.

### Publish the release on GitHub

Open the draft release, and assign the version tag to it (e.g. `v0.5.0`). Publish!

### Announcement

Announce the release on our usual channels: Discord, Keybase, Twitter, etc.

## Non-stable releases

Unstable releases (release candidates, beta versions, or feature-specific releases) can be published using other npm tags than `@latest`. For beta or release candidates, use the `@next` tag. This process can be much more direct than the one we use for stable releases.

It follows the steps described in the previous section with some notable differences:

- Release notes they are optional in non-stable releases.
- `yarn publish-version` should be prefixed with the `NPM_TAG` environment variable set to the tag you want to use, without the `@` (e.g. `NPM_TAG=next yarn publish-version`). Because you might want to use a non-incremental version number, you generally also have to specify the exact version using the `NEW_VERSION` environment variable (e.g. `NEW_VERSION=0.7.0-beta.2 NPM_TAG=next yarn publish-version`).
- Publishing the release on GitHub is optional. If you do so, remember to check the “This is a pre-release” checkbox before doing so.
- Announcing the version is optional too, and depends entirely on the context of the release.
