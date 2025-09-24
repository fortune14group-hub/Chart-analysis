let lastLink: string | null = null;

export function setLastMagicLink(url: string) {
  lastLink = url;
  console.log("[Magic Link]", url);
}

export function getLastMagicLink() {
  return lastLink;
}
