export type ComponentData = Record<string, any>;

export interface IComponent {
  data: ComponentData;
  components: Record<string, any>;
  onMounted: (...args: any) => void;
  onBeforeMounted: (...args: any) => void;
  onUnmounted: (...args: any) => void;
  onUpdate: (...args: any) => void;
  onBeforeUpdate: (...args: any) => void;
}

export type ComponentProps = [string, Partial<IComponent>];
export type FnComponent<T = {} | undefined> = (props: T) => ComponentProps;
