import { getCollection, type CollectionEntry } from 'astro:content';

export type Pattern = CollectionEntry<'patterns'>;
export type Cluster = CollectionEntry<'clusters'>;

export async function getPatterns(): Promise<Pattern[]> {
  const all = await getCollection('patterns', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getClusters(): Promise<Cluster[]> {
  const all = await getCollection('clusters');
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** Clusters paired with their (non-draft) patterns; empty clusters are dropped. */
export async function getClusterGroups() {
  const [clusters, patterns] = await Promise.all([getClusters(), getPatterns()]);
  return clusters
    .map((cluster) => ({ cluster, patterns: patterns.filter((p) => p.data.cluster === cluster.id) }))
    .filter((group) => group.patterns.length > 0);
}
