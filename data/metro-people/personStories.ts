export const PERSON_STORY_SECTIONS = [
  { id: 'life-trajectory', title: 'LIFE TRAJECTORY' },
  { id: 'mobility-pattern', title: 'MOBILITY PATTERN' },
  { id: 'first-metro-ride', title: 'MY FIRST METRO RIDE' },
  { id: 'moments', title: 'MOMENTS' },
  { id: 'metro-vs-other-transport', title: 'THE METRO VS OTHER TRANSPORT' },
  { id: 'places-transformed-by-metro', title: 'PLACES TRANSFORMED BY THE ADVENT METRO' },
  { id: 'key-metro-network-nodes', title: 'KEY NODES IN THE SHENZHEN METRO NETWORK' },
  { id: 'metro-impact-on-my-life', title: "THE METRO'S IMPACT ON MY LIFE" },
  { id: 'metro-impact-on-shenzhen', title: "THE METRO'S IMPACT ON SHENZHEN" },
] as const;

export type PersonStorySectionId = (typeof PERSON_STORY_SECTIONS)[number]['id'];

export type PersonStory = {
  personId: string;
  sections: Array<{
    id: PersonStorySectionId;
    paragraphs: string[];
  }>;
};

const storyModules = import.meta.glob('./person-stories/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, PersonStory>;

export function getPersonStory(personId: string) {
  return Object.values(storyModules).find((story) => story.personId === personId);
}
