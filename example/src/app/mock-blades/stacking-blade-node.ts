import { SduiBladeNode } from '@slashand/sdui-blade-core';

export type StackingBladeWidth = 'full' | 'menu' | 'small' | 'medium' | 'large' | 'xlarge';

/** Stable IDs let Core put every journey level in the URL and restore it on reload. */
export function createStackingChild(depth: number, width: StackingBladeWidth): SduiBladeNode {
  return {
    id: `stack-${depth}-${width}`,
    type: 'stack-test' as SduiBladeNode['type'],
    properties: { title: `Depth Level: ${depth}`, depth, width } as SduiBladeNode['properties'],
    children: [],
  };
}

export function resolveStackingChild(id: string): SduiBladeNode | undefined {
  const match = /^stack-([1-9]\d*)-(full|menu|small|medium|large|xlarge)$/.exec(id);
  if (!match) return undefined;
  const depth = Number(match[1]);
  if (!Number.isSafeInteger(depth) || depth < 2) return undefined;
  return createStackingChild(depth, match[2] as StackingBladeWidth);
}
