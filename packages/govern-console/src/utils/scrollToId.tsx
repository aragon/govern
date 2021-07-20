/**
 * scrollToId allowes to scroll to any element of a page by id.
 * @param {string} id - defaults to header id of the app header.
 */
const scrollToId = (id = 'header') => {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
};

export default scrollToId;
