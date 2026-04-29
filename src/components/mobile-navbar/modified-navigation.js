function normalizeItem(item) {
  const children = item?.child || item?.children;
  const child = Array.isArray(children)
    ? children.map(normalizeItem).filter(Boolean)
    : null;

  if (!item?.title) {
    return null;
  }

  const url = item?.url || item?.href || null;

  if (child?.length) {
    return {
      title: item.title,
      child,
      extLink: Boolean(item?.extLink),
      url
    };
  }

  if (!url) {
    return null;
  }

  return {
    title: item.title,
    url,
    extLink: Boolean(item?.extLink)
  };
}

// MODIFY THE NAVIGATION WITH NEW STRUCTURE
export const updateNavigation = navigation => {
  if (!Array.isArray(navigation)) {
    return [];
  }

  return navigation.map(curr => {
    const childGroups = curr?.child || curr?.children;

    if ((curr?.megaMenu || curr?.megaMenuWithSub) && Array.isArray(childGroups)) {
      return {
        title: curr.title,
        url: curr?.url || curr?.href || null,
        child: childGroups.flat().map(normalizeItem).filter(Boolean)
      };
    }

    return normalizeItem(curr);
  }).filter(Boolean);
};